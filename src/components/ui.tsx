import Link from "next/link"
import { ChevronLeft, ChevronRight, Plus, X, ArrowLeft } from "lucide-react"
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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 mb-8">
      <div className="flex items-start gap-4">
        {index && (
          <div className="brut-sticker w-12 h-12 text-lg shrink-0 -rotate-3">
            {index}
          </div>
        )}
        <div>
          <h1 className="brut-title brut-h1">{title}</h1>
          {desc && <p className="text-sm text-muted mt-1.5 font-medium">{desc}</p>}
        </div>
        {extra}
      </div>
      {children && <div className="flex items-center gap-3 flex-wrap">{children}</div>}
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
    <ButtonLink href={href} variant="primary">
      <Plus className="w-4 h-4" strokeWidth={3} />
      {children}
    </ButtonLink>
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
        <div className="flex items-center justify-between gap-3 border-b-[3px] border-ink bg-paper2 px-5 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            {Icon && (
              <span className="brut-sticker w-8 h-8 text-sm shrink-0 rotate-3">
                <Icon className="w-4 h-4" strokeWidth={3} />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="brut-title brut-h3 leading-tight">{title}</h3>
              {sub && <p className="text-xs text-muted font-medium truncate">{sub}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
      )}
      <div className={noPad ? "" : `p-5 ${bodyClassName}`}>{children}</div>
    </div>
  )
}

/* ============================================================
   Table
   ============================================================ */
export function Table({
  head,
  children,
}: {
  head: ReactNode
  children: ReactNode
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead className="brut-thead">{head}</thead>
        <tbody className="brut-tbody">{children}</tbody>
      </table>
    </div>
  )
}

export function TH({ children, className = "" }: { children?: ReactNode; className?: string }) {
  return <th className={className}>{children}</th>
}

export function TD({ children, className = "", colSpan }: { children?: ReactNode; className?: string; colSpan?: number }) {
  return <td colSpan={colSpan} className={className}>{children}</td>
}

export function Tr({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={`brut-tr ${className}`}>{children}</tr>
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
    <div className="flex items-center justify-between gap-3 border-t-[3px] border-ink bg-paper2 px-4 py-3">
      <p className="text-xs font-bold text-muted uppercase tracking-wider">
        Halaman {page} <span className="opacity-60">/ {totalPages}</span>
      </p>
      <div className="flex gap-2">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/80 brut-stripe" onClick={onCancel} />
      <div className="brut-card relative w-full max-w-md p-6 brut-pop rotate-[-0.5deg]">
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
        <div className="flex justify-end gap-3">
          <Button onClick={onCancel}>Batal</Button>
          <Button variant="danger" onClick={onConfirm}>
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
    <div className="p-12 text-center">
      {Icon && (
        <div className="brut-sticker w-16 h-16 text-2xl mx-auto mb-4 rotate-3">
          <Icon className="w-8 h-8" strokeWidth={2.5} />
        </div>
      )}
      <p className="text-sm font-bold text-muted uppercase tracking-wider mb-4">{text}</p>
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
    <div className={`brut-card p-5 ${faceMap[face]} ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest opacity-70">{title}</p>
          <p className="brut-num text-3xl mt-1.5 leading-none">{value}</p>
          {sub && <p className="text-xs font-semibold mt-2 opacity-75">{sub}</p>}
        </div>
        <span className="w-11 h-11 shrink-0 grid place-items-center border-[3px] border-ink bg-card text-ink rotate-3">
          <Icon className="w-5 h-5" strokeWidth={2.5} />
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
    <div className={`brut-card ${maxWidth} ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-2.5 border-b-[3px] border-ink bg-paper2 px-5 py-3.5">
          {Icon && (
            <span className="brut-sticker w-8 h-8 text-sm rotate-3">
              <Icon className="w-4 h-4" strokeWidth={3} />
            </span>
          )}
          <h3 className="brut-title brut-h3 uppercase">{title}</h3>
        </div>
      )}
      <div className="p-5 sm:p-6">{children}</div>
      {footer && (
        <div className="flex justify-end gap-3 border-t-[3px] border-ink bg-paper2 px-5 py-4">
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