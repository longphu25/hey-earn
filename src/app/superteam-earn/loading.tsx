export default function Loading() {
  return (
    <div>
      <div className="mb-8">
        <div className="skeleton h-10 w-1/2 mb-2"></div>
        <div className="skeleton h-4 w-1/3"></div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card card-border h-full bg-base-100">
            <div className="card-body">
              <div className="flex items-center gap-2 mb-2">
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-4 w-24"></div>
              </div>
              <div className="skeleton h-6 w-4/5 mb-2"></div>
              <div className="skeleton h-16 w-full mb-3"></div>
              <div className="flex justify-between">
                <div className="skeleton h-5 w-16"></div>
                <div className="skeleton h-5 w-24"></div>
              </div>
              <div className="flex gap-2 mt-3">
                <div className="skeleton h-5 w-12"></div>
                <div className="skeleton h-5 w-12"></div>
                <div className="skeleton h-5 w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
