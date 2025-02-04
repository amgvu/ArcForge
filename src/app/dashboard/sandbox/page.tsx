'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from "next-auth/react";
import { GenerativeThemes } from '@/lib/utilities/gemini';
import { DSInput } from '@/components'; 

const DashboardPage = () => {
  const [theme, setTheme] = useState('');
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState<string[] | null>(null); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      setIsLoaded(true);
    }, []);
  
    useEffect(() => {
      if (status === 'unauthenticated') {
        signIn('discord');
      }
    }, [status]);

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

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <div>Redirecting to sign-in...</div>;
  }

  return (
    <div className="min-h-screen font-[family-name:var(--font-geist-sans)] text-[#D7DADC] flex justify-center bg-neutral-900 p-4 space-y-4">
    <div className={`text-center space-y-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <h1 className="text-2xl font-semibold text-neutral-100">Arc Studio</h1>
      <p>This feature uses generative AI to create names. Answers may be false or inaccurate.</p>
      <div className="mt-4">
        <DSInput
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Enter a theme (e.g., Overwatch, Marvel Heroes)"
          className={"w-full outline outline-neutral-600 text-center bg-neutral-800 text-neutral-100 rounded"}
        />
      </div>
      <button
        onClick={fetchItems}
        className="px-4 py-2 mt-4 text-neutral-100 bg-neutral-600 rounded cursor-pointer hover:bg-blue-400 transition-all"
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
    </div>
  );
};

export default DashboardPage;


