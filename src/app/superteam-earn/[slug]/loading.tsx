export default function Loading() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="skeleton h-12 w-12 rounded-full"></div>
        <div>
          <div className="skeleton mb-2 h-8 w-64"></div>
          <div className="skeleton h-4 w-32"></div>
        </div>
      </div>

      <div className="mt-8 mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="card card-border bg-base-100">
          <div className="card-body">
            <div className="skeleton h-5 w-24"></div>
            <div className="skeleton mt-2 h-8 w-32"></div>
          </div>
        </div>
        <div className="card card-border bg-base-100">
          <div className="card-body">
            <div className="skeleton h-5 w-24"></div>
            <div className="skeleton mt-2 h-8 w-32"></div>
          </div>
        </div>
        <div className="card card-border bg-base-100">
          <div className="card-body">
            <div className="skeleton h-5 w-24"></div>
            <div className="skeleton mt-2 h-6 w-16"></div>
          </div>
        </div>
      </div>

      <div className="card card-border bg-base-100 mb-8">
        <div className="card-body">
          <div className="skeleton mb-4 h-6 w-32"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-4/5"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card card-border bg-base-100">
          <div className="card-body">
            <div className="skeleton mb-4 h-6 w-32"></div>
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-6 w-16"></div>
              ))}
            </div>
          </div>
        </div>
        <div className="card card-border bg-base-100">
          <div className="card-body">
            <div className="skeleton mb-4 h-6 w-32"></div>
            <div className="skeleton h-6 w-32"></div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <div className="skeleton h-12 w-64"></div>
      </div>
    </div>
  );
}
