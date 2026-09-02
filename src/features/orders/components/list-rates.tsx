import { CheckCircle2, Clock, Truck } from "lucide-react"

import { IShippoRate } from "../types/rates"
import { cn } from "@/lib/utils"

interface Props {
  rates: IShippoRate[]
  selectedRateId?: string
  onSelectRate: (rate: IShippoRate) => void
}

const ListRates = ({ rates, selectedRateId, onSelectRate }: Props) => {
  if (!rates || rates.length === 0) return null

  return (
    <div className="space-y-2.5">
      <h3 className="border-b border-border pb-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Shipping Rates ({rates.length})
      </h3>

      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {rates.map((rate) => {
          const isSelected = selectedRateId === rate.object_id
          const hasErrors = rate.messages?.some((m) => m.type === "error")

          return (
            <button
              key={rate.object_id}
              type="button"
              onClick={() => onSelectRate(rate)}
              className={cn(
                "flex w-full items-center justify-between gap-4 rounded-lg border p-3 text-left transition-colors cursor-pointer",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:bg-muted/40"
              )}
            >
              <div className="flex min-w-0 items-center gap-3">
                {rate.provider_image_75 ? (
                  <img
                    src={rate.provider_image_75}
                    alt={rate.provider}
                    className="h-8 w-8 shrink-0 rounded-md border border-border bg-background object-contain p-1"
                  />
                ) : (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-(--text-h)">
                    {rate.provider}
                    {rate.servicelevel?.name && (
                      <span className="font-normal text-muted-foreground"> · {rate.servicelevel.name}</span>
                    )}
                  </p>

                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    {rate.estimated_days != null && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {rate.estimated_days} {rate.estimated_days === 1 ? "day" : "days"}
                      </span>
                    )}
                    {hasErrors && (
                      <span className="text-destructive">Unavailable</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="text-sm font-bold text-(--text-h)">
                  {Number.parseFloat(rate.amount).toLocaleString()} {rate.currency}
                </span>
                {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ListRates