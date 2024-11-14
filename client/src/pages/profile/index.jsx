import React, { useState, useRef, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaPlus, FaTrash } from "react-icons/fa";
import {
  selectLoader,
  selectUser,
  updateUserProfileAsync,
} from "../../features/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoader);
  const { register, handleSubmit } = useForm();
  const [hovered, setHovered] = useState(false);
  const [image, setImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  // Function to handle form submission
  const onSubmit = async (data) => {
    try {
      // console.log("data :",data);
      // Create FormData object
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("color", selectedColor);
      if (image) {
        console.log("image :", image);
        formData.append("profilePicture", image);
      }

      // console.log("formData", formData);
      const result = await dispatch(updateUserProfileAsync(formData)).unwrap();
      // console.log("result", result);
      if (result.statusCode === 200) {
        toast.success("Profile updated successfully");
        navigate("/chat");
      }
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  // Function to handle navigation back to chat or setup profile
  const handleNavigate = () => {
    if (user?.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please set up profile.");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    // console.log("file",file);
    if (file) {
      setImage(file);
    }
  };

  const handleDeleteImage = async () => {
    setImage(null); // Clear the image state
  };

  return (
    <div className="bg-[#1b1c24] h-screen flex items-center justify-center flex-col gap-10">
      {loading && <div>Loading...</div>}

      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div onClick={handleNavigate}>
          <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer" />
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-5"
        >
          <div
            className="h-48 relative flex items-center justify-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            {/* Left side: Avatar and Image Upload */}
            <Avatar className="w-48 h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={URL.createObjectURL(image)}
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div
                  className={`uppercase rounded-full w-48 h-48 text-5xl border-[1px] flex items-center justify-center ${getColor(
                    selectedColor
                  )}`}
                >
                  {user?.firstName
                    ? user?.firstName.charAt(0)
                    : user?.email.charAt(0)}
                </div>
              )}
            </Avatar>
            {hovered && (
              <div
                className="absolute w-48 h-48  flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              // accept=".png, .jpg, .jpeg, .svg, .webp"
            />
          </div>
          {/* Right side: Input fields and Color selection */}
          <div className="flex flex-col gap-5 text-white">
            <Input
              placeholder="First Name"
              type="text"
              defaultValue={user?.firstName}
              {...register("firstName", { required: true })}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
            <Input
              placeholder="Last Name"
              type="text"
              defaultValue={user?.lastName}
              {...register("lastName", { required: true })}
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
            />
            <div className="flex gap-4 sm:gap-8">
              {colors.map((color, index) => (
                <div
                  key={index}
                  className={`${getColor(
                    index
                  )} w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${
                    selectedColor === index
                      ? "outline outline-white/50 outline-1"
                      : ""
                  }`}
                  onClick={() => setSelectedColor(index)}
                ></div>
              ))}
            </div>
          </div>
          <div className="col-span-2">
            <Button
              type="submit"
              className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
            >
              Save Changes
            </Button>

            {/* Save Changes Button */}
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
