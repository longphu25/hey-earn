'use client';

import type { SuperteamEarnProject } from '@/services/superteam-earn';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectCardProps {
  project: SuperteamEarnProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const { title, rewardAmount, token = 'USDC', deadline, slug, sponsor, status } = project;

  // Extract sponsor information
  const orgName = sponsor?.name;
  const orgLogo = sponsor?.logo;

  // Format deadline
  const deadlineDate = new Date(deadline);
  const formattedDeadline = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(deadlineDate);

  // Check if deadline has passed
  const isPastDeadline = deadlineDate < new Date();

  return (
    <Link href={`/superteam-earn/${slug}`}>
      <div className="card card-border bg-base-100 h-full transition-shadow hover:shadow-md">
        <div className="card-body">
          <div className="mb-2 flex items-center gap-2">
            {orgLogo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
              src={orgLogo}
              alt={orgName || 'Organization'}
              width={24}
              height={24}
              className="rounded-full h-6 w-6 object-cover"
              />
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-200" />
            )}
            <span className="text-sm opacity-75">{orgName || 'Organization'}</span>
          </div>

          <h2 className="card-title text-lg font-semibold">{title}</h2>

          {/* Status badge */}
          <div className="badge badge-outline badge-sm">{status}</div>

          <div className="mt-4 flex items-center justify-between">
            <div className="badge badge-success">
              {rewardAmount} {token}
            </div>

            <div
              className={`text-xs ${isPastDeadline ? 'text-error' : 'text-base-content opacity-75'}`}
            >
              Due: {formattedDeadline}
            </div>
          </div>

          {/* Display submission count if available */}
          {project._count && (
            <div className="mt-3 flex-wrap gap-1">
              <div className="text-xs opacity-75">
                <span>Submissions: {project._count.Submission}</span>
                {project._count.Comments > 0 && (
                  <span className="ml-2">Comments: {project._count.Comments}</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
