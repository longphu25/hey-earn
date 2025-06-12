import { ProjectDetails } from '@/components/superteam-earn';
import { fetchSuperteamEarnProjectBySlug } from '@/services/superteam-earn';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the project page
export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const project = await fetchSuperteamEarnProjectBySlug(slug);

    if (!project) {
      return {
        title: 'Project not found',
        description: 'This project could not be found or has been removed.',
      };
    }

    return {
      title: `${project.title} | Superteam Earn`,
      description: project.description.slice(0, 160),
    };
  } catch (error) {
    return {
      title: 'Project Details | Superteam Earn',
      description: 'View details about this Superteam Earn project',
    };
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;

  if (!slug) {
    notFound();
  }

  return <ProjectDetails slug={slug} />;
}
