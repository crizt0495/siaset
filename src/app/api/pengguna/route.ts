import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { forbidden, isSuperadmin } from "@/lib/authz"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSuperadmin(session.user)) return forbidden()

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { namaLengkap: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
      ]
    }

    const [data, total] = await Promise.all([
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          namaLengkap: true,
          username: true,
          komisiId: true,
          fotoProfil: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          komisi: true,
          roles: {
            select: {
              role: { select: { id: true, name: true } },
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ])

    return NextResponse.json({
      data: data.map((u) => ({
        ...u,
        roles: u.roles.map((ur) => ur.role),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("GET pengguna error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!isSuperadmin(session.user)) return forbidden()

    const body = await request.json()

    const existing = await prisma.user.findUnique({
      where: { username: body.username },
    })

    if (existing) {
      return NextResponse.json(
        { error: "Username sudah ada" },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    const user = await prisma.$transaction(async (tx) => {
      const result = await tx.user.create({
        data: {
          namaLengkap: body.namaLengkap,
          username: body.username,
          password: hashedPassword,
          komisiId: body.komisiId || null,
          fotoProfil: body.fotoProfil || null,
          active: body.active !== undefined ? body.active : true,
        },
        include: {
          komisi: true,
        },
      })

      if (body.roleIds && body.roleIds.length > 0) {
        await tx.userRole.createMany({
          data: body.roleIds.map((roleId: string) => ({
            userId: result.id,
            roleId,
          })),
        })
      }

      const roles = await tx.userRole.findMany({
        where: { userId: result.id },
        include: { role: true },
      })

      return { ...result, roles: roles.map((ur) => ur.role) }
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menambah pengguna baru: ${user.namaLengkap} (${user.username})`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { penggunaId: user.id, action: "create" },
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("POST pengguna error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
