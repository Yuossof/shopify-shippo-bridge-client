import { MapPin } from "lucide-react"

const AddressesEmptyState = () => {
  return (
    <div className="mx-auto my-6 w-full max-w-[1800px] rounded-xl border border-dashed border-border bg-card p-12 text-center shadow-sm">
      <MapPin className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
      <h3 className="text-lg font-semibold text-[var(--text-h)]">No Addresses Found</h3>
      <p className="mt-1 text-sm text-muted-foreground">Click "Add Address" to create your first address.</p>
    </div>
  )
}

export default AddressesEmptyState
