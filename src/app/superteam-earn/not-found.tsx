import Link from 'next/link';

export default function SuperteamEarnNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-4 text-center">
      <div className="card card-border bg-base-100 mx-auto max-w-md shadow-xl">
        <div className="card-body">
          <h1 className="mb-6 text-4xl font-bold">Project Not Found</h1>
          <p className="text-base-content/70 mb-8">
            We couldn't find the project you're looking for. It might have been removed or the URL
            could be incorrect.
          </p>
          <div className="card-actions justify-center">
            <Link href="/superteam-earn" className="btn btn-primary">
              Back to Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
