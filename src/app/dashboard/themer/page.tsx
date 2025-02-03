'use client';

import { useState } from 'react';
import { GenerativeThemes } from '@/lib/utilities/gemini';
import { DSInput } from '@/components'; 

const DashboardPage = () => {
  const [theme, setTheme] = useState('');
  const [items, setItems] = useState<string[] | null>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = async () => {
    if (!theme.trim()) {
      setError('Please enter a theme to generate the list.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await GenerativeThemes(theme);
      const itemList = result.split(',').map((item) => item.trim());
      setItems(itemList);
    } catch (err) {
      console.error(err);
      setError('Failed to generate the list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 text-center bg-neutral-900">
      <h1 className="text-2xl font-semibold font-[family-name:var(--font-geist-mono)] text-neutral-100">Theme Generator</h1>
      <div className="mt-4">
        <DSInput
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Enter a theme (e.g., Overwatch, Marvel Heroes)"
          className="w-full text-center bg-neutral-800 text-neutral-100 rounded"
        />
      </div>
      <button
        onClick={fetchItems}
        className="px-4 py-2 mt-4 text-neutral-100 bg-neutral-600 rounded cursor-pointer hover:bg-indigo-500 transition-all"
      >
        Generate
      </button>

      {loading && <p className="mt-4 text-neutral-100">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {items && (
        <ul className="mt-4 text-neutral-100">
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardPage;


