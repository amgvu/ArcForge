export const menuButtonStyles =
  'w-full flex justify-between items-center bg-zinc-800 border border-zinc-700 rounded-md p-2 text-left h-10';

export const menuItemsStyles =
  'absolute z-10 mt-1 w-full bg-zinc-800 border border-zinc-700 rounded-md shadow-lg';

export const menuItemStyles = (active: boolean) => {
  return `${
    active ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-300'
  } block w-full text-left px-4 py-2 text-sm`;
};