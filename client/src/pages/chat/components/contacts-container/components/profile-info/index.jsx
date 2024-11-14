import React from "react";
import { useNavigate } from "react-router-dom";
import { FiEdit2 } from "react-icons/fi";
import { IoPowerSharp } from "react-icons/io5";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useSelector } from "react-redux";
import { selectUser } from "../../../../../../features/auth/authSlice";
import { signOutAsync } from "../../../../../../features/auth/authSlice";
import { useDispatch } from "react-redux";
function ProfileInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  const handleSignOut = async () => {
    try {
      const result = await dispatch(signOutAsync()).unwrap();
      if (result.statusCode === 200) {
        navigate("/auth");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-5 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
          <Avatar className="h-12 w-12 rounded-full overflow-hidden">
            {user?.profilePicture ? (
              <AvatarImage
                src={user?.profilePicture}
                className="object-cover w-full h-full bg-black"
              />
            ) : (
              <div
                className={`uppercase  rounded-full w-12 h-12 text-lg border-[1px] flex items-center justify-center ${getColor(
                  user?.color
                )}`}
              >
                {user?.firstName
                  ? user?.firstName.charAt(0)
                  : user?.email.charAt(0)}
              </div>
            )}
          </Avatar>
        </div>
        <div>
          {user?.firstName && user?.lastName
            ? `${user.firstName} ${user.lastName}`
            : ""}
        </div>
      </div>
      <div className="flex gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <FiEdit2
                className="text-purple-500 text-xl font-medium"
                onClick={() => navigate("/profile")}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Edit Profile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoPowerSharp
                className="text-red-500 text-xl font-medium"
                onClick={handleSignOut}
              />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none text-white">
              <p>Logout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

export default ProfileInfo;
