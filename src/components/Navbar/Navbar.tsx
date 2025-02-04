"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { Home, ScrollText, Sparkles, LogIn, LogOut } from "lucide-react";

export default function DSNavbar() {
  const { data: session } = useSession();

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    ...(session
      ? [{ name: "Control Center", href: "/dashboard", icon: <ScrollText className="h-5 w-5" /> }]
      : []),
    ...(session
      ? [{ name: "Arc Studio", href: "/dashboard/sandbox", icon: <Sparkles className="h-5 w-5" /> }]
      : []),
  ];

  return (
    <nav className="top-0 left-0 w-full backdrop-blur-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24">
        <div className="flex justify-between items-center h-full">
          <ul className="menu menu-horizontal bg-neutral-800 border-1 border-neutral-700 rounded-box">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} className="tooltip tooltip-bottom" data-tip={item.name}>
                  {item.icon}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="menu menu-horizontal bg-neutral-800 border-1 border-neutral-700 rounded-box">
            {session ? (
              <li>
                <button
                  onClick={() => signOut()}
                  className="tooltip tooltip-bottom"
                  data-tip="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </li>
            ) : (
              <li>
                <button
                  onClick={() => signIn()}
                  className="tooltip"
                  data-tip="Sign In"
                >
                  <LogIn className="h-5 w-5" />
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}




