// components/orders-error-state.tsx
import { AlertCircle } from "lucide-react"

type OrdersErrorStateProps = {
  message: string
  onRetry: () => void
}

const OrdersErrorState = ({ message, onRetry }: OrdersErrorStateProps) => {
  return (
    <div className="mx-auto my-12 max-w-md rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center shadow-sm">
      <AlertCircle className="mx-auto mb-3 h-10 w-10 text-destructive" />
      <p className="mb-4 text-sm font-medium text-[var(--text-h)]">{message}</p>
      <button
        onClick={onRetry}
        className="rounded-md bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--primary-foreground)] shadow-sm"
      >
        Try Again
      </button>
    </div>
  )
}

export default OrdersErrorState