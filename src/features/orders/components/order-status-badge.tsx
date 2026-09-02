import { CheckCircle2, Clock, RotateCcw, HelpCircle } from "lucide-react"

type OrderStatusBadgeProps = {
  status?: string | null
}

const STATUS_STYLES: Record<
  string,
  { label: string; icon: typeof Clock; className: string }
> = {
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-[oklch(0.94_0.03_75)] text-[oklch(0.42_0.09_65)]",
  },
  fulfilled: {
    label: "Shipped",
    icon: CheckCircle2,
    className: "bg-[oklch(0.94_0.03_155)] text-[oklch(0.4_0.08_155)]",
  },
  shipped: {
    label: "Shipped",
    icon: CheckCircle2,
    className: "bg-[oklch(0.94_0.03_155)] text-[oklch(0.4_0.08_155)]",
  },
  refunded: {
    label: "Refunded",
    icon: RotateCcw,
    className: "bg-[oklch(0.94_0.025_15)] text-[oklch(0.45_0.08_10)]",
  },
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const key = status?.toLowerCase() ?? ""
  const entry = STATUS_STYLES[key]

  if (!entry) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <HelpCircle className="h-3.5 w-3.5" />
        {status || "Unknown"}
      </span>
    )
  }

  const Icon = entry.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${entry.className}`}
    >
      <Icon className="h-3.5 w-3.5" />
      {entry.label}
    </span>
  )
}

export default OrderStatusBadge