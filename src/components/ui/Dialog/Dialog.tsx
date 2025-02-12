import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DSDialogProps {
  isOpen: boolean;
  title: string;
  message: ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DSDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}: DSDialogProps) => (
  <Dialog
    open={isOpen}
    as="div"
    className="relative transition-all z-10 focus:outline-none"
    onClose={onCancel}
  >
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-10 w-screen overflow-y-auto"
    >
      <div className="flex min-h-full bg-black/10 transition-all items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0">
          <DialogTitle as="h3" className="text-base/7 font-medium text-white">
            {title}
          </DialogTitle>
          <div className="mt-2 text-sm/6 text-white/50">{message}</div>
          <div className="mt-4 flex gap-3">
            <Button
              className="inline-flex cursor-pointer transition-all items-center gap-2 rounded-md bg-neutral-700 py-1.5 px-3 text-sm/6 font-semibold text-neutral-100 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-neutral-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-neutral-700"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              className="inline-flex cursor-pointer transition-all items-center gap-2 rounded-md bg-neutral-700 py-1.5 px-3 text-sm/6 font-semibold text-neutral-100 shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-neutral-600 data-[focus]:outline-1 data-[focus]:outline-white data-[open]:bg-neutral-700"
              onClick={onConfirm}
            >
              Confirm
            </Button>
          </div>
        </DialogPanel>
      </div>
    </motion.div>
  </Dialog>
);

export default DSDialog;
