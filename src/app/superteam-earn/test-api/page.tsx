'use client';

import { useState } from 'react';
import { fetchSuperteamEarnProjects } from '@/services/superteam-earn';

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function testApi() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSuperteamEarnProjects();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">API Test Page</h1>
      <button onClick={testApi} className="btn btn-primary mb-4" disabled={loading}>
        {loading ? 'Loading...' : 'Test API Call'}
      </button>

      {error && (
        <div className="alert alert-error mb-4">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="card card-border bg-base-100">
          <div className="card-body">
            <h2 className="card-title">API Response</h2>
            <div className="overflow-x-auto">
              <pre className="text-sm">{JSON.stringify(result, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
