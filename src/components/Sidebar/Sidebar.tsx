"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import {
  Home,
  ScrollText,
  LogIn,
  LogOut,
  ShieldX,
  Aperture,
  Menu,
  UsersRound,
  Coffee,
  Mail,
} from "lucide-react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-5 w-5" /> },
    ...(session
      ? [
          {
            name: "Dashboard",
            href: "/dashboard",
            icon: <Aperture className="h-5 w-5" />,
          },
        ]
      : []),

    {
      name: "Getting Started",
      href: "/getting-started",
      icon: <Coffee className="h-5 w-5" />,
    },
    {
      name: "About Us",
      href: "/about-us",
      icon: <UsersRound className="h-5 w-5" />,
    },
    { name: "Contact", href: "/contact", icon: <Mail className="h-5 w-5" /> },
    {
      name: "Privacy Policy",
      href: "/privacy-policy",
      icon: <ShieldX className="h-5 w-5" />,
    },
    {
      name: "Terms Of Service",
      href: "/terms-of-service",
      icon: <ScrollText className="h-5 w-5" />,
    },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col min-h-screen">
        <div className="lg:hidden fixed top-0 left-0 w-full bg-neutral-800 z-10 px-4 py-3">
          <label htmlFor="sidebar-drawer" className="btn btn-square btn-ghost">
            <Menu className="h-5 w-5" />
          </label>
        </div>

        <div>{children}</div>
      </div>

      <div className="drawer-side z-20">
        <label
          htmlFor="sidebar-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="menu h-full border-r border-neutral-700 w-60 bg-neutral-800 text-neutral-content fixed">
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="sticky top-0 bg-neutral-800 p-4 border-b border-neutral-700">
              <h2 className="text-xl font-medium">Project Arcs</h2>
            </div>

            <div className="flex-1 p-4">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-neutral-700 rounded-lg"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sticky bottom-0 bg-neutral-800 p-4 border-t border-neutral-700">
              {session ? (
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-3 px-4 py-2 w-full cursor-pointer transition-all  hover:bg-neutral-700 rounded-lg"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="flex items-center gap-3 px-4 py-2 w-full cursor-pointer transition-all  hover:bg-neutral-700 rounded-lg"
                >
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
