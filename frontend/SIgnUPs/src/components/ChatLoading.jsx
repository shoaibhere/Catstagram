import { Fragment } from "react";
import { Dialog } from "@headlessui/react";

const ChatLoading = () => {
  return (
    <Dialog open={true} onClose={() => {}}>
      <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
      <div className="flex justify-center items-center min-h-screen">
        <div className="space-y-4">
          {/* Create loading skeletons using Tailwind */}
          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="w-48 h-12 bg-gray-300 rounded-md animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    </Dialog>
  );
};

export default ChatLoading;
