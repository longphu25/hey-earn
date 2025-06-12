'use client';

import { useSuperteamEarnProjects } from '@/services/superteam-earn';
import { ProjectCard } from './ProjectCard';

export function ProjectsList() {
  const { data, isLoading, error } = useSuperteamEarnProjects();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card card-border bg-base-100 h-full">
            <div className="card-body">
              <div className="mb-2 flex items-center gap-2">
                <div className="skeleton h-6 w-6 rounded-full"></div>
                <div className="skeleton h-4 w-24"></div>
              </div>
              <div className="skeleton mb-2 h-6 w-4/5"></div>
              <div className="skeleton mb-3 h-16 w-full"></div>
              <div className="flex justify-between">
                <div className="skeleton h-5 w-16"></div>
                <div className="skeleton h-5 w-24"></div>
              </div>
              <div className="mt-3 flex gap-2">
                <div className="skeleton h-5 w-12"></div>
                <div className="skeleton h-5 w-12"></div>
                <div className="skeleton h-5 w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <div>
            <span>Failed to load projects. Please try again later.</span>
            <span className="block text-xs mt-1">{error?.message}</span>
        </div>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="alert alert-info">
        <div>
          <span>No projects found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.data.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
