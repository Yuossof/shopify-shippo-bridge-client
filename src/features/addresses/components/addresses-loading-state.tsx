const AddressesLoadingState = () => {
  return (
    <div className="mx-auto w-full space-y-6 p-4 sm:p-6 lg:px-8 2xl:max-w-[1800px] animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="h-9 w-32 rounded bg-muted" />
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="h-12 border-b border-border bg-muted" />
        {[1, 2, 3].map((n) => (
          <div key={n} className="mx-4 h-16 border-b border-border/50 bg-card" />
        ))}
      </div>
    </div>
  )
}

export default AddressesLoadingState
