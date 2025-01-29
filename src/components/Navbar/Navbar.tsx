import Link from "next/link";
import { Tab, TabGroup, TabList } from '@headlessui/react';

export default function DSNavbar() {
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Dashboard', href: '/dashboard' }
  ];

  return (
    <nav className="fixed top-0 left-0 w-full backdrop-blur-md  z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16">
        <div className="flex justify-center items-center h-full">
          <TabGroup>
            <TabList className="flex gap-4">
              {navItems.map((item) => (
                <Tab
                  key={item.name}
                  as={Link}
                  href={item.href}
                  className="rounded-full py-1 px-3 text-sm/6 transition-all font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
                >
                  {item.name}
                </Tab>
              ))}
            </TabList>
          </TabGroup>
        </div>
      </div>
    </nav>
  );
}
