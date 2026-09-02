import { LucideIcon } from "lucide-react"

type StatCardProps = {
  label: string
  value: string
  icon: LucideIcon
  hint?: string
}

const StatCard = ({ label, value, icon: Icon, hint }: StatCardProps) => {
  return (
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <p className="mt-1.5 text-2xl font-semibold tracking-tight text-[var(--text-h)]">
          {value}
        </p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-bg)]">
        <Icon className="h-4.5 w-4.5 text-[oklch(0.5_0.15_300)]" strokeWidth={2} />
      </div>
    </div>
  )
}

export default StatCard