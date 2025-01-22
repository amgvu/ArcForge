import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { menuButtonStyles, menuItemsStyles, menuItemStyles } from './Menu.styles';

interface DSMenuProps {
  items: string[];
  selectedItem: string;
  setSelectedItem: (item: string) => void;
}

const DSMenu: React.FC<DSMenuProps> = ({ items, selectedItem, setSelectedItem }) => {
  const title = selectedItem ? selectedItem : '';

  return (
    <Menu as="div" className="relative w-full">
      <Menu.Button className={menuButtonStyles}>
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
        <Menu.Items className={menuItemsStyles}>
          <div className="py-1">
            {items.map((item) => (
              <Menu.Item key={item}>
                {({ active }) => (
                  <button
                    className={menuItemStyles(active)}
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

export default DSMenu;