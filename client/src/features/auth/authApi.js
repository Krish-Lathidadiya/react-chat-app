import axios from "axios";

export const signUp = async (formData) => {
  try {
    const response = await axios.post("/server/auth/signup", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message;

    throw new Error(errorMessage || "Sign-up failed. Please try again later.");
  }
};

export const signIn = async (formData) => {
  try {
    const response = await axios.post("/server/auth/login", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message;

    throw new Error(errorMessage || "Sign-In failed. Please try again later.");
  }
};

export const getUserInfo = async () => {
  try {
    const response = await axios.get("/server/auth/user-info", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message;

    throw new Error(
      errorMessage || "Get user-info failed. Please try again later."
    );
  }
};

export const updateUserProfile = async (formData) => {
  try {
    const response = await axios.put("/server/auth/update-profile", formData);

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message;

    throw new Error(
      errorMessage || "Upadate user failed. Please try again later."
    );
  }
};

export const signOut = async () => {
  try {
    const response = await axios.post("/server/auth/signout");

    return response.data;
  } catch (error) {
    const errorMessage =
      error.response &&
      error.response.data &&
      error.response.data.errors &&
      error.response.data.errors.length > 0
        ? error.response.data.errors.join(", ")
        : error.response.data.message;

    throw new Error(
      errorMessage || "User Sign-Out failed. Please try again later."
    );
  }
};
