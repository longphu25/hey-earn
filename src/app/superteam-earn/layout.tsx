import Link from 'next/link';
import Image from 'next/image';
import type { ReactNode } from 'react';

export default function SuperteamEarnLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-base-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
                <path d="M12 3v6" />
              </svg>
              <span className="font-semibold">Superteam Earn</span>
            </Link>

            <nav className="flex items-center gap-4">
              <Link href="/superteam-earn" className="hover:underline">
                Projects
              </Link>
              <Link href="/superteam-earn/bounties" className="hover:underline">
                Bounties
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto flex-1 px-4 py-8">{children}</main>

      <footer className="bg-base-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-75">
            Data provided by{' '}
            <a
              href="https://earn.superteam.fun"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Superteam Earn
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
