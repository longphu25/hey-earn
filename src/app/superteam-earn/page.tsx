import { ProjectsList } from '@/components/superteam-earn';
import Link from 'next/link';

export const metadata = {
  title: 'Superteam Earn Projects',
  description: 'Browse projects from Superteam Earn',
};

export default function SuperteamEarnPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Superteam Earn Projects</h1>
        <p className="text-base-content mb-4 opacity-75">
          Find the latest projects from the Solana ecosystem
        </p>
        <Link href="/superteam-earn/server-demo" className="btn btn-sm btn-outline">
          View Server-Rendered Demo
        </Link>
      </div>

      <ProjectsList />
    </div>
  );
}
