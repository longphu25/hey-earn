'use client';

import { useSuperteamEarnProjectBySlug } from '@/services/superteam-earn';
import Image from 'next/image';
import Link from 'next/link';

interface ProjectDetailsProps {
  slug: string;
}

export function ProjectDetails({ slug }: ProjectDetailsProps) {
  const { data: project, isLoading, error } = useSuperteamEarnProjectBySlug(slug);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="skeleton h-12 w-12 rounded-full"></div>
          <div>
            <div className="skeleton mb-2 h-8 w-64"></div>
            <div className="skeleton h-4 w-32"></div>
          </div>
        </div>

        <div className="skeleton mt-8 mb-4 h-6 w-3/4"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-2/3"></div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="skeleton h-24 w-full"></div>
          <div className="skeleton h-24 w-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <div>
          <span>Failed to load project details. Please try again later.</span>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="alert alert-warning">
        <div>
          <span>Project not found. It may have been removed or is no longer available.</span>
          <Link href="/superteam-earn" className="btn btn-sm btn-primary mt-4">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const {
    title,
    description,
    amount,
    token = 'USDC',
    deadline,
    orgName,
    orgLogo,
    skillsRequired,
    region,
    status,
    projectType,
  } = project;

  // Format deadline
  const deadlineDate = new Date(deadline);
  const formattedDeadline = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(deadlineDate);

  // Check if deadline has passed
  const isPastDeadline = deadlineDate < new Date();

  return (
    <>
      <div className="mb-8">
        <div className="mb-6 flex items-center gap-4">
          {orgLogo ? (
            <Image
              src={orgLogo}
              alt={orgName || 'Organization'}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
              {orgName ? orgName.charAt(0) : 'O'}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-base-content opacity-75">
              Posted by {orgName || 'Organization'} • {region}
            </p>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card card-border bg-base-100">
            <div className="card-body">
              <h3 className="card-title text-lg">Reward</h3>
              <div className="text-success text-2xl font-bold">
                {amount} {token}
              </div>
            </div>
          </div>

          <div className="card card-border bg-base-100">
            <div className="card-body">
              <h3 className="card-title text-lg">Deadline</h3>
              <div className={`${isPastDeadline ? 'text-error' : ''}`}>
                {formattedDeadline}
                {isPastDeadline && <span className="block text-sm">(Expired)</span>}
              </div>
            </div>
          </div>

          <div className="card card-border bg-base-100">
            <div className="card-body">
              <h3 className="card-title text-lg">Status</h3>
              <div className="badge badge-outline">{status || 'Open'}</div>
            </div>
          </div>
        </div>

        <div className="card card-border bg-base-100 mb-8">
          <div className="card-body">
            <h2 className="card-title mb-2 text-xl">Description</h2>
            <div className="prose max-w-none">
              <p>{description}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="card card-border bg-base-100">
            <div className="card-body">
              <h3 className="card-title text-lg">Skills Required</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {skillsRequired.map((skill) => (
                  <div key={skill} className="badge badge-outline">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card card-border bg-base-100">
            <div className="card-body">
              <h3 className="card-title text-lg">Project Type</h3>
              <div>{projectType || 'Not specified'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <a
          href={`https://earn.superteam.fun/listings/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-wide"
        >
          Apply on Superteam Earn
        </a>
      </div>
    </>
  );
}
