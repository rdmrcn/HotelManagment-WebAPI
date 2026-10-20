export function AuthSkeleton() {
  return (
    <div className="mx-auto w-full max-w-md" role="status">
      <div className="h-[30rem] animate-pulse rounded-3xl bg-muted" />
      <span className="sr-only">Loading…</span>
    </div>
  )
}

export function BookingSkeleton() {
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px]" role="status">
      <div className="grid gap-4">
        <div className="h-8 w-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-20 animate-pulse rounded-2xl bg-muted" />
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="h-32 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="h-80 animate-pulse rounded-2xl bg-muted" />
      <span className="sr-only">Loading the booking desk…</span>
    </div>
  )
}

export function RoomsSkeleton() {
  return (
    <div role="status">
      <div className="h-16 animate-pulse rounded-2xl bg-muted" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-[27rem] animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
      <span className="sr-only">Loading rooms…</span>
    </div>
  )
}
