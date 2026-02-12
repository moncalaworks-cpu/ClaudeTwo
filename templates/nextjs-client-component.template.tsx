// Template: Next.js Client Component
// Mark as 'use client' when you need interactivity

'use client';

import { useState, useEffect, useCallback } from 'react';

interface [Entity] {
  id: number;
  name: string;
  description?: string;
}

interface Props {
  [entityId]?: number;
}

/**
 * Client Component for interactive [Entity] features
 *
 * Use when you need:
 * - Event handlers (onClick, onChange)
 * - Hooks (useState, useEffect, useContext)
 * - Browser APIs
 */
export function [Entity]List({ [entityId] }: Props) {
  const [[entities], set[Entities]] = useState<[Entity][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');

  // Data fetching
  useEffect(() => {
    const fetch[Entities] = async () => {
      try {
        setLoading(true);
        const query = filter ? `?filter=${encodeURIComponent(filter)}` : '';
        const response = await fetch(`/api/[entities]${query}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch [entities]: ${response.status}`);
        }

        const data = await response.json();
        set[Entities](data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        set[Entities]([]);
      } finally {
        setLoading(false);
      }
    };

    fetch[Entities]();
  }, [filter]);

  // Handle filter change
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  }, []);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;

    try {
      const response = await fetch(`/api/[entities]/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete [entity]');
      }

      set[Entities]([entities].filter(item => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  return (
    <div className="space-y-4">
      {/* Filter Input */}
      <input
        type="text"
        placeholder="Filter [entities]..."
        value={filter}
        onChange={handleFilterChange}
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
      />

      {/* [Entities] List */}
      <div className="space-y-2">
        {[entities].length === 0 ? (
          <p className="text-gray-500">No [entities] found</p>
        ) : (
          [entities].map(entity => (
            <div
              key={entity.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div>
                <h3 className="font-semibold">{entity.name}</h3>
                {entity.description && (
                  <p className="text-sm text-gray-600">{entity.description}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(entity.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
