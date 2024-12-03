import { ChatState } from "../../Context/ChatProvider";

const UserBadgeItem = ({ user, handleFunction, admin }) => {
  const { user: loggedInUser } = ChatState(); // Get current user from ChatState

  return (
    <div
      className="flex items-center px-2 py-1 m-1 mb-2 rounded-lg bg-purple-600 text-white text-xs cursor-pointer"
      onClick={handleFunction}
    >
      <span>{user.name}</span>
      {admin === user._id && <span className="ml-1">(Admin)</span>}
      {loggedInUser._id === user._id && (
        <span className="ml-1 text-green-400">(You)</span> // Display "You" for the logged-in user
      )}
      <button
        className="ml-2 p-1 rounded-full hover:bg-purple-700"
        onClick={(e) => {
          e.stopPropagation();
          handleFunction();
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
};

export default UserBadgeItem;
