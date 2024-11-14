import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginImg, victorySvg } from "../../assets";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { signInAsync, signUpAsync } from "../../features/auth/authSlice";

function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    reset: resetLogin,
    formState: { errors: errorsLogin },
  } = useForm();
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    reset: resetSignup,
    watch: watchSignup,
    formState: { errors: errorsSignup },
  } = useForm();

  const onSubmitLogin = async (formData) => {
    try {
      const result = await dispatch(signInAsync(formData)).unwrap();

      if (result.statusCode === 200) {
        if (result.data.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }

      resetLogin();
    } catch (error) {
      toast(error);
    }
  };

  const onSubmitSignup = async (formData) => {
    try {
      const result = await dispatch(signUpAsync(formData)).unwrap();
      // console.log(result);
      if (result.statusCode === 200) {
        toast("signup successful");
        resetSignup();
      }
    } catch (error) {
      toast(error);
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) || "Invalid email address";
  };

  const validatePasswordsMatch = (value) => {
    return value === watchSignup("password") || "Passwords do not match";
  };

  return (
    <div className="py-5 h-[100vh] w-[100vw] flex items-center justify-center">
      <div className="h-auto p-3 bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid lg:grid-cols-2">
        {/* left side */}
        <div className="flex flex-col gap-10 items-center justify-center ">
          {/* welcome text with emoji */}
          <div className="flex  w-72 mx-auto items-center justify-center flex-col">
            <div className="flex items-center justify-center ">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={victorySvg} alt="victory Emoji" className="h-[100px]" />
            </div>
            <p className="font-medium text-center">
              Fill in the details to get started with the best chat app!
            </p>
          </div>

          <div className="flex items-center justify-center w-full">
            <Tabs className="w-3/4" defaultValue="login">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90
            border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-transparent text-black text-opacity-90
            border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                >
                  Signup
                </TabsTrigger>
              </TabsList>
              {/* login */}
              <TabsContent value="login" className="mt-5">
                <form
                  onSubmit={handleSubmitLogin(onSubmitLogin)}
                  className="flex flex-col gap-3 "
                >
                  <Input
                    {...registerLogin("email", {
                      required: "Email is required",
                      validate: validateEmail,
                    })}
                    placeholder="Email"
                    type="text"
                    className="rounded-full p-6"
                  />
                  {errorsLogin.email && (
                    <span className="text-sm ml-3 text-red-500">
                      {errorsLogin.email.message}
                    </span>
                  )}
                  <Input
                    {...registerLogin("password", {
                      required: "Password is required",
                    })}
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                  />
                  {errorsLogin.password && (
                    <span className="text-sm ml-3 text-red-500">
                      {errorsLogin.password.message}
                    </span>
                  )}
                  <Button type="submit" className="rounded-full p-6">
                    Login
                  </Button>
                </form>
              </TabsContent>
              {/* signup */}
              <TabsContent value="signup" className="mt-5">
                <form
                  onSubmit={handleSubmitSignup(onSubmitSignup)}
                  className="flex flex-col gap-3"
                >
                  <Input
                    {...registerSignup("email", {
                      required: "Email is required",
                      validate: validateEmail,
                    })}
                    placeholder="Email"
                    type="email"
                    className="rounded-full p-6"
                  />
                  {errorsSignup.email && (
                    <span className="text-sm ml-3 text-red-500">
                      {errorsSignup.email.message}
                    </span>
                  )}
                  <Input
                    {...registerSignup("password", {
                      required: "Password is required",
                    })}
                    placeholder="Password"
                    type="password"
                    className="rounded-full p-6"
                  />
                  {errorsSignup.password && (
                    <span className="text-sm ml-3 text-red-500">
                      {errorsSignup.password.message}
                    </span>
                  )}
                  <Input
                    {...registerSignup("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: validatePasswordsMatch,
                    })}
                    placeholder="Confirm Password"
                    type="password"
                    className="rounded-full p-6"
                  />
                  {errorsSignup.confirmPassword && (
                    <span className="text-sm ml-3 text-red-500">
                      {errorsSignup.confirmPassword.message}
                    </span>
                  )}

                  <Button type="submit" className="rounded-full p-6">
                    Signup
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        {/* right side */}
        <div className="hidden lg:flex justify-center items-center">
          <img src={loginImg} alt="background login" className="h-[500px]" />
        </div>
      </div>
    </div>
  );
}

export default Auth;
