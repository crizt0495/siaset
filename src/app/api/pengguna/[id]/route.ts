import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        komisi: true,
        roles: { include: { role: true } },
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...userWithoutPassword } = user

    return NextResponse.json({
      ...userWithoutPassword,
      roles: user.roles.map((ur) => ur.role),
    })
  } catch (error) {
    console.error("GET pengguna detail error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (body.username && body.username !== existing.username) {
      const duplicate = await prisma.user.findUnique({
        where: { username: body.username },
      })
      if (duplicate) {
        return NextResponse.json(
          { error: "Username sudah ada" },
          { status: 409 }
        )
      }
    }

    const updateData: Record<string, unknown> = {
      namaLengkap: body.namaLengkap ?? existing.namaLengkap,
      username: body.username ?? existing.username,
      komisiId: body.komisiId !== undefined ? body.komisiId : existing.komisiId,
      fotoProfil: body.fotoProfil !== undefined ? body.fotoProfil : existing.fotoProfil,
      active: body.active !== undefined ? body.active : existing.active,
    }

    if (body.password) {
      updateData.password = await bcrypt.hash(body.password, 10)
    }

    const user = await prisma.$transaction(async (tx) => {
      const result = await tx.user.update({
        where: { id },
        data: updateData,
        include: { komisi: true },
      })

      if (body.roleIds && Array.isArray(body.roleIds)) {
        await tx.userRole.deleteMany({ where: { userId: id } })
        if (body.roleIds.length > 0) {
          await tx.userRole.createMany({
            data: body.roleIds.map((roleId: string) => ({
              userId: id,
              roleId,
            })),
          })
        }
      }

      const roles = await tx.userRole.findMany({
        where: { userId: id },
        include: { role: true },
      })

      return { ...result, roles: roles.map((ur) => ur.role) }
    })

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _pw, ...userWithoutPassword } = user

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Mengubah data pengguna: ${user.namaLengkap}`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { penggunaId: user.id, action: "update" },
      },
    })

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error("PUT pengguna error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    await prisma.$transaction(async (tx) => {
      await tx.userRole.deleteMany({ where: { userId: id } })
      await tx.userPermission.deleteMany({ where: { userId: id } })
      await tx.aktivitas.updateMany({ where: { userId: id }, data: { userId: null } })
      await tx.pemeliharaan.updateMany({ where: { userId: id }, data: { userId: null } })
      await tx.penghapusan.updateMany({ where: { userId: id }, data: { userId: null } })
      await tx.mutasi.updateMany({ where: { userId: id }, data: { userId: null } })
      await tx.barang.updateMany({ where: { userId: id }, data: { userId: null } })
      await tx.user.delete({ where: { id } })
    })

    await prisma.aktivitas.create({
      data: {
        userId: session.user.id,
        aktivitas: `Menghapus pengguna: ${existing.namaLengkap} (${existing.username})`,
        ipAddress: request.headers.get("x-forwarded-for") || null,
        userAgent: request.headers.get("user-agent") || null,
        meta: { penggunaId: id, action: "delete" },
      },
    })

    return NextResponse.json({ message: "User deleted" })
  } catch (error) {
    console.error("DELETE pengguna error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
