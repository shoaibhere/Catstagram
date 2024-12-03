import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ handleFunction }) => {
  const { user } = ChatState();

  return (
    <div
      onClick={handleFunction}
      className="flex items-center bg-gray-200 hover:bg-teal-500 hover:text-white cursor-pointer px-3 py-2 mb-2 rounded-lg w-full"
    >
      <img
        src={user.pic}
        alt={user.name}
        className="mr-2 w-10 h-10 rounded-full object-cover cursor-pointer"
      />
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-xs">
          <strong>Email: </strong>
          {user.email}
        </p>
      </div>
    </div>
  );
};

export default UserListItem;
