const OrdersLoadingState = () => {
  return (
    <div className="mx-auto w-full space-y-6 p-4 sm:p-6 lg:px-8 2xl:max-w-[1800px] animate-pulse">
      <div className="h-8 w-48 rounded bg-muted" />
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-md">
        <div className="h-12 border-b border-border bg-muted" />
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="mx-4 h-16 border-b border-border/50 bg-card" />
        ))}
      </div>
    </div>
  )
}

export default OrdersLoadingState