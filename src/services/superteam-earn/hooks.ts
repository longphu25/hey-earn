'use client';

import { useQuery } from '@tanstack/react-query';
import {
  fetchSuperteamEarnProjects,
  fetchSuperteamEarnProjectBySlug,
  type SuperteamEarnResponse,
  type SuperteamEarnProject,
} from './api';

export function useSuperteamEarnProjects(page = 0, limit = 30) {
  return useQuery<SuperteamEarnResponse>({
    queryKey: ['superteam-earn', 'projects', page, limit],
    queryFn: () => fetchSuperteamEarnProjects(page, limit),
  });
}

export function useSuperteamEarnProjectBySlug(slug: string) {
  return useQuery<SuperteamEarnProject | null>({
    queryKey: ['superteam-earn', 'project', slug],
    queryFn: () => fetchSuperteamEarnProjectBySlug(slug),
    enabled: !!slug,
  });
}
