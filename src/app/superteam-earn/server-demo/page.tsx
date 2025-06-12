// Server-side component demonstration
import { fetchSuperteamEarnProjectsFromServer } from '@/services/superteam-earn';
import { ProjectCard } from '@/components/superteam-earn';
import Link from 'next/link';

export const metadata = {
  title: 'Superteam Earn Projects - Server Demo',
  description: 'Server-side rendering demonstration for Superteam Earn projects',
};

export default async function ServerDemoPage() {
  // Server-side data fetching
  const projectsData = await fetchSuperteamEarnProjectsFromServer(0, 30);

  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Superteam Earn Projects - Server Demo</h1>
        <p className="text-base-content mb-4 opacity-75">
          This page demonstrates server-side rendering with direct API calls
        </p>
        <Link href="/superteam-earn" className="btn btn-sm btn-primary">
          Back to client-rendered page
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projectsData.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      <div className="mt-6">
        <p className="text-base-content opacity-75">
          Total projects: {projectsData.total} | Page: {projectsData.page + 1} of{' '}
          {Math.ceil(projectsData.total / projectsData.limit)}
        </p>
      </div>

      {/* <div className="mt-6">
        <p className="text-base-content opacity-75">
          Total projects: {projectsData.total} | Page: {projectsData.page + 1} of{' '}
          {Math.ceil(projectsData.total / projectsData.limit)}
        </p>
      </div> */}
    </div>
  );
}
