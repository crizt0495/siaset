import Link from "next/link"
import {
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Plus, X, ArrowLeft, Inbox,
} from "@/components/icons"
import type { ElementType, ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"

/* ============================================================
   Page header
   ============================================================ */
export function PageHeader({
  index,
  title,
  desc,
  children,
  extra,
}: {
  index?: string
  title: string
  desc?: string
  children?: ReactNode
  extra?: ReactNode
}) {
  return (
    <div className="mb-5 sm:mb-8">
      <div className="flex items-start gap-3 sm:gap-4">
        {index && (
          <div className="brut-sticker w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg shrink-0 -rotate-3">
            {index}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="brut-title brut-h1 break-words">{title}</h1>
          {desc && <p className="text-xs sm:text-sm text-muted mt-1.5 font-medium break-words">{desc}</p>}
          {extra && <div className="mt-2 sm:mt-2">{extra}</div>}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap mt-4">{children}</div>
      )}
    </div>
  )
}

/* ============================================================
   Buttons
   ============================================================ */
type Variant =
  | "default"
  | "primary"
  | "dark"
  | "warn"
  | "danger"
  | "good"
  | "vibe"

const variantClass: Record<Variant, string> = {
  default: "",
  primary: "brut-btn-primary",
  dark: "brut-btn-dark",
  warn: "brut-btn-warn",
  danger: "brut-btn-danger",
  good: "brut-btn-good",
  vibe: "brut-btn-vibe",
}

export function Button({
  variant = "default",
  small,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  small?: boolean
  href?: undefined
}) {
  return (
    <button
      className={`brut-btn ${variantClass[variant]} ${small ? "brut-btn-sm" : ""} ${className}`}
      {...props}
    />
  )
}

export function ButtonLink({
  variant = "default",
  small,
  href,
  className = "",
  children,
}: {
  variant?: Variant
  small?: boolean
  href: string
  className?: string
  children: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`brut-btn ${variantClass[variant]} ${small ? "brut-btn-sm" : ""} ${className}`}
    >
      {children}
    </Link>
  )
}

export function AddButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <>
      <Link
        href={href}
        aria-label={typeof children === "string" ? children : undefined}
        className="brut-btn brut-btn-primary fixed bottom-[calc(env(safe-area-inset-bottom)+5rem)] right-4 z-40 md:hidden !w-14 !h-14 !min-h-0 !rounded-full !p-0 shadow-[4px_4px_0_0_var(--shadow)]"
      >
        <Plus className="w-6 h-6" strokeWidth={3} />
      </Link>
      <ButtonLink href={href} variant="primary" className="hidden md:inline-flex">
        <Plus className="w-4 h-4" strokeWidth={3} />
        {children}
      </ButtonLink>
    </>
  )
}

export function IconButton({
  title,
  variant = "default",
  className = "",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  title?: string
  children: ReactNode
}) {
  return (
    <button
      title={title}
      className={`brut-iconbtn ${variant !== "default" ? `brut-iconbtn-${variant}` : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

/* ============================================================
   Form controls
   ============================================================ */
export function Field({
  label,
  required,
  children,
  hint,
}: {
  label: string
  required?: boolean
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <label className="brut-field-label">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted mt-1 font-medium">{hint}</p>}
    </div>
  )
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`brut-input ${props.className || ""}`} />
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`brut-select ${props.className || ""}`} />
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`brut-textarea ${props.className || ""}`} />
}

/* ============================================================
   Badge
   ============================================================ */
const badgeColors: Record<string, string> = {
  default: "brut-badge-gray",
  gray: "brut-badge-gray",
  blue: "brut-badge-blue",
  green: "brut-badge-green",
  good: "brut-badge-green",
  red: "brut-badge-red",
  yellow: "brut-badge-yellow",
  warn: "brut-badge-yellow",
  purple: "brut-badge-purple",
}

export function Badge({
  color = "default",
  children,
}: {
  color?: "default" | "gray" | "blue" | "green" | "good" | "red" | "yellow" | "warn" | "purple"
  children: ReactNode
}) {
  return <span className={`brut-badge ${badgeColors[color] || ""}`}>{children}</span>
}

/* ============================================================
   Card
   ============================================================ */
export function Card({
  title,
  sub,
  icon: Icon,
  actions,
  className = "",
  bodyClassName = "",
  children,
  noPad,
}: {
  title?: string
  sub?: string
  icon?: ElementType
  actions?: ReactNode
  className?: string
  bodyClassName?: string
  children: ReactNode
  noPad?: boolean
}) {
  return (
    <div className={`brut-card ${className}`}>
      {(title || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-b-[3px] border-ink bg-paper2 px-3.5 sm:px-5 py-3">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {Icon && (
              <span className="brut-sticker w-8 h-8 text-sm shrink-0 rotate-3">
                <Icon className="w-4 h-4" strokeWidth={3} />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="brut-title brut-h3 leading-tight">{title}</h3>
              {sub && <p className="text-[0.68rem] text-muted font-medium leading-snug">{sub}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={noPad ? "" : `p-3.5 sm:p-5 ${bodyClassName}`}>{children}</div>
    </div>
  )
}

/* ============================================================
   Data list — mobile-first
   Renders a stacked card list on phones and a table from `md` up.
   ============================================================ */
export type ListSlot = "title" | "subtitle" | "chip" | "meta" | "actions" | "hidden"

export type ListColumn<T> = {
  /** Column heading, also used as the label for `meta` slots on mobile. */
  header: string
  render: (row: T, index: number) => ReactNode
  /** Where this cell goes in the mobile card. Defaults to `meta`. */
  slot?: ListSlot
  className?: string
  headClassName?: string
}

export function DataList<T>({
  columns,
  rows,
  getKey,
  page = 1,
  perPage,
  loading = false,
  loadingText = "Memuat data...",
  emptyIcon,
  emptyText = "Tidak ada data",
  emptyAction,
}: {
  columns: ListColumn<T>[]
  rows: T[]
  getKey: (row: T, index: number) => string
  page?: number
  perPage?: number
  loading?: boolean
  loadingText?: string
  emptyIcon?: ElementType
  emptyText?: string
  emptyAction?: ReactNode
}) {
  const colCount = columns.length
  const offset = perPage ? (page - 1) * perPage : 0

  if (loading) {
    return (
      <div className="py-12 text-center text-muted font-bold text-sm uppercase tracking-wider">
        {loadingText}
      </div>
    )
  }

  if (rows.length === 0) {
    return <EmptyState icon={emptyIcon || Inbox} text={emptyText} action={emptyAction} />
  }

  const titleCols = columns.filter((c) => (c.slot ?? "meta") === "title")
  const subCols = columns.filter((c) => c.slot === "subtitle")
  const chipCols = columns.filter((c) => c.slot === "chip")
  const metaCols = columns.filter((c) => (c.slot ?? "meta") === "meta")
  const actionCols = columns.filter((c) => c.slot === "actions")

  return (
    <>
      {/* ---------- Mobile: stacked cards ---------- */}
      <ul className="md:hidden divide-y-[3px] divide-ink">
        {rows.map((row, i) => (
          <li key={getKey(row, i)} className="p-3.5 active:bg-paper2">
            {titleCols.map((c) => (
              <div key={c.header} className="text-[0.95rem] font-bold leading-snug break-words">
                {c.render(row, offset + i)}
              </div>
            ))}
            {subCols.map((c) => (
              <div key={c.header} className="font-mono text-xs text-muted break-words">
                {c.render(row, offset + i)}
              </div>
            ))}

            {chipCols.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                {chipCols.map((c) => (
                  <span key={c.header} className="contents">
                    {c.render(row, offset + i)}
                  </span>
                ))}
              </div>
            )}

            {metaCols.length > 0 && (
              <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-2">
                {metaCols.map((c) => (
                  <div key={c.header} className="min-w-0">
                    <dt className="text-[0.6rem] font-bold text-muted uppercase tracking-wider">
                      {c.header}
                    </dt>
                    <dd className="text-[0.8rem] font-semibold break-words mt-0.5">{c.render(row, offset + i)}</dd>
                  </div>
                ))}
              </dl>
            )}

            {actionCols.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                {actionCols.map((c) => (
                  <span key={c.header} className="contents">
                    {c.render(row, offset + i)}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>

      {/* ---------- md and up: table ---------- */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="brut-thead">
            <tr>
              {columns.map((c) => (
                <th key={c.header} className={c.headClassName || ""}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="brut-tbody">
            {rows.map((row, i) => (
              <tr key={getKey(row, i)} className="brut-tr">
                {columns.map((c) => (
                  <td key={c.header} className={c.className || ""}>
                    {c.render(row, offset + i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <span className="sr-only">{colCount} kolom data</span>
    </>
  )
}

/** Row wrapper so action groups align left on mobile cards. */
export function ListActions({ children }: { children: ReactNode }) {
  return <span className="flex items-center gap-2 flex-wrap">{children}</span>
}

/** Square index tile shown at the start of a mobile card. */
export function ListIndex({ value }: { value: number }) {
  return (
    <span className="brut-sticker w-7 h-7 text-[0.7rem] shrink-0 -rotate-3">{value}</span>
  )
}

/* ============================================================
   Detail row — label / value pair, stacks on narrow screens
   ============================================================ */
export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-0.5 xs:gap-4 py-2.5 border-b-2 border-ink/10 last:border-0">
      <span className="text-[0.68rem] font-bold text-muted uppercase tracking-wider shrink-0">
        {label}
      </span>
      <span className="text-sm font-bold xs:text-right break-words min-w-0">{value}</span>
    </div>
  )
}

/* ============================================================
   Pagination
   ============================================================ */
export function Pagination({
  page,
  totalPages,
  setPage,
}: {
  page: number
  totalPages: number
  setPage: (n: number | ((p: number) => number)) => void
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t-[3px] border-ink bg-paper2 px-3 sm:px-4 py-3">
      <p className="text-[0.68rem] sm:text-xs font-bold text-muted uppercase tracking-wider min-w-0 truncate">
        Halaman <span className="brut-num text-ink">{page}</span>
        <span className="opacity-60"> / {totalPages}</span>
      </p>
      <div className="flex gap-2 shrink-0">
        <IconButton
          onClick={() => setPage(1)}
          disabled={page <= 1}
          title="Halaman pertama"
          className="hidden sm:inline-flex"
        >
          <ChevronsLeft className="w-4 h-4" strokeWidth={3} />
        </IconButton>
        <IconButton
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          title="Sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={3} />
        </IconButton>
        <IconButton
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page >= totalPages}
          title="Berikutnya"
        >
          <ChevronRight className="w-4 h-4" strokeWidth={3} />
        </IconButton>
        <IconButton
          onClick={() => setPage(totalPages)}
          disabled={page >= totalPages}
          title="Halaman terakhir"
          className="hidden sm:inline-flex"
        >
          <ChevronsRight className="w-4 h-4" strokeWidth={3} />
        </IconButton>
      </div>
    </div>
  )
}

/* ============================================================
   Confirm modal
   ============================================================ */
export function ConfirmModal({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  label = "Hapus",
}: {
  open: boolean
  title: string
  message: string
  onCancel: () => void
  onConfirm: () => void
  label?: string
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink/80 brut-stripe" onClick={onCancel} />
      <div className="brut-card relative w-full sm:max-w-md p-6 sm:pt-8 rounded-t-2xl sm:rounded-none brut-sheet sm:brut-pop sm:rotate-[-0.5deg]">
        <span className="mx-auto mb-4 block h-1.5 w-12 rounded-full bg-ink/25 sm:hidden" />
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 p-1 text-muted hover:text-danger transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" strokeWidth={3} />
        </button>
        <div className="brut-sticker w-12 h-12 text-lg -rotate-3 mb-4">!</div>
        <h3 className="brut-title brut-h2 mb-2">{title}</h3>
        <p className="text-sm text-muted mb-6 font-medium">{message}</p>
        <div className="grid grid-cols-1 sm:flex sm:justify-end gap-3">
          <Button onClick={onCancel} className="w-full sm:w-auto">
            Batal
          </Button>
          <Button variant="danger" onClick={onConfirm} className="w-full sm:w-auto">
            {label}
          </Button>
        </div>
      </div>
    </div>
  )
}

/* ============================================================
   States (loading / empty / error)
   ============================================================ */
export function LoadingState({ text = "Memuat data..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="brut-sticker w-14 h-14 text-xl">
          <svg className="w-7 h-7 animate-spin" viewBox="0 0 24 24" fill="none">
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
          </svg>
        </div>
        <p className="text-sm font-bold text-muted uppercase tracking-wider brut-blink">{text}</p>
      </div>
    </div>
  )
}

export function EmptyState({
  icon: Icon,
  text = "Tidak ada data",
  action,
}: {
  icon?: ElementType
  text?: string
  action?: ReactNode
}) {
  return (
    <div className="p-8 sm:p-12 text-center">
      {Icon && (
        <div className="brut-sticker w-14 h-14 sm:w-16 sm:h-16 text-xl sm:text-2xl mx-auto mb-4 rotate-3">
          <Icon className="w-7 h-7 sm:w-8 h-8" strokeWidth={2.5} />
        </div>
      )}
      <p className="text-[0.7rem] sm:text-sm font-bold text-muted uppercase tracking-wider mb-4 break-words">
        {text}
      </p>
      {action}
    </div>
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-center max-w-sm">
        <div className="brut-sticker w-16 h-16 text-2xl bg-danger -rotate-3">!</div>
        <p className="brut-title brut-h3">Gagal memuat data</p>
        <p className="text-sm text-muted font-medium">{message}</p>
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            Coba Lagi
          </Button>
        )}
      </div>
    </div>
  )
}

/* ============================================================
   Stat card
   ============================================================ */
const faceMap: Record<string, string> = {
  primary: "bg-primary text-white",
  warn: "bg-warn",
  danger: "bg-danger text-white",
  good: "bg-good",
  vibe: "bg-vibe text-white",
  paper: "bg-paper2",
}

export function StatCard({
  icon: Icon,
  title,
  value,
  sub,
  face = "primary",
  className = "",
}: {
  icon: ElementType
  title: string
  value: ReactNode
  sub?: string
  face?: "primary" | "warn" | "danger" | "good" | "vibe" | "paper"
  className?: string
}) {
  return (
    <div className={`brut-card p-3.5 sm:p-5 ${faceMap[face]} ${className}`}>
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="min-w-0">
          <p className="text-[0.6rem] sm:text-[0.65rem] font-bold uppercase tracking-widest opacity-70 leading-tight">
            {title}
          </p>
          <p className="brut-num text-xl xs:text-2xl sm:text-3xl mt-1.5 leading-none break-words">{value}</p>
          {sub && <p className="text-[0.68rem] sm:text-xs font-semibold mt-2 opacity-75 leading-snug">{sub}</p>}
        </div>
        <span className="w-9 h-9 sm:w-11 sm:h-11 shrink-0 grid place-items-center border-[3px] border-ink bg-card text-ink rotate-3">
          <Icon className="w-4 h-4 sm:w-5 h-5" strokeWidth={2.5} />
        </span>
      </div>
    </div>
  )
}

/* ============================================================
   Form helpers
   ============================================================ */
export function BackLink({ href, text = "Kembali" }: { href: string; text?: string }) {
  return (
    <>
      <Link
        href={href}
        className="brut-iconbtn brut-iconbtn-warn no-print"
        title={text}
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={3} />
      </Link>
      <span className="sr-only">{text}</span>
    </>
  )
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="brut-card bg-danger p-4 mb-6 flex items-center gap-3">
      <span className="w-8 h-8 grid place-items-center bg-card border-[3px] border-ink text-danger font-display shrink-0">!</span>
      <p className="text-sm font-bold text-white">{message}</p>
    </div>
  )
}

export function FormCard({
  title,
  icon: Icon,
  children,
  footer,
  className = "",
  maxWidth = "max-w-4xl",
}: {
  title: string
  icon?: ElementType
  children: ReactNode
  footer?: ReactNode
  className?: string
  maxWidth?: string
}) {
  return (
    <div className={`brut-card w-full ${maxWidth} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-2.5 border-b-[3px] border-ink bg-paper2 px-3.5 sm:px-5 py-3">
          {Icon && (
            <span className="brut-sticker w-8 h-8 text-sm rotate-3 shrink-0">
              <Icon className="w-4 h-4" strokeWidth={3} />
            </span>
          )}
          <h3 className="brut-title brut-h3 uppercase break-words">{title}</h3>
        </div>
      )}
      <div className="p-3.5 sm:p-6">{children}</div>
      {footer && (
        <div className="flex flex-col-reverse xs:flex-row xs:justify-end gap-2 xs:gap-3 border-t-[3px] border-ink bg-paper2 px-3.5 sm:px-5 py-3.5">
          {footer}
        </div>
      )}
    </div>
  )
}

/* ============================================================
   Marquee ticker
   ============================================================ */
export function Marquee({
  items,
  className = "",
}: {
  items: string[]
  className?: string
}) {
  const row = [...items, ...items]
  return (
    <div className={`brut-marquee mb-8 ${className}`}>
      <div className="brut-marquee-inner">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-3">
            {item}
            <svg className="w-3 h-3 fill-current" viewBox="0 0 12 12">
              <path d="M6 0l6 6-6 6-6-6z" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ============================================================
   Toolbar chip (label above quick info rows)
   ============================================================ */
export function Label({
  icon: Icon,
  children,
  color = "default",
}: {
  icon?: ElementType
  children: ReactNode
  color?: "default" | "blue" | "yellow" | "warn" | "green" | "good" | "red" | "purple"
}) {
  const bg: Record<string, string> = {
    default: "bg-paper2",
    blue: "bg-primary text-white",
    yellow: "bg-warn",
    warn: "bg-warn",
    green: "bg-good",
    good: "bg-good",
    red: "bg-danger text-white",
    purple: "bg-vibe text-white",
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 border-2 border-ink text-xs font-bold uppercase tracking-wider ${bg[color]}`}
    >
      {Icon && <Icon className="w-3.5 h-3.5" strokeWidth={3} />}
      {children}
    </span>
  )
}