import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface MenuComponentProps {
    items: string[];
    selectedItem: string;
    setSelectedItem: (item: string) => void;
}

const MenuComponent: React.FC<MenuComponentProps> = ({ items, selectedItem, setSelectedItem }) => {
    const title = selectedItem ? selectedItem : '';

    return (
        <Menu as="div" className="relative w-full">
            <Menu.Button className="w-full flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-md p-2 text-left h-10">
                {title}
                <ChevronDownIcon className="h-5 w-5 text-zinc-400" aria-hidden="true" />
            </Menu.Button>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg">
                    <div className="py-1">
                        {items.map((item) => (
                            <Menu.Item key={item}>
                                {({ active }) => (
                                    <button
                                        className={`${
                                            active ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-300'
                                        } block w-full text-left px-4 py-2 text-sm`}
                                        onClick={() => setSelectedItem(item)}
                                    >
                                        {item}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default MenuComponent;