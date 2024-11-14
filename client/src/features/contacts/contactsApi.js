import axios from "axios";

export const searchContacts = async (searchTerm) => {
  // console.log("searchTerm", searchTerm);
  try {
    const response = await axios.post(
      "/server/contacts/search",
      { searchTerm },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

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
      errorMessage || "Search Contact failed. Please try again later."
    );
  }
};

export const getContactsForDMList = async () => {
  try {
    const response = await axios.get("/server/contacts/get-contacts-for-dm");

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
      errorMessage || "Search Contact failed. Please try again later."
    );
  }
};

export const getAllContacts = async () => {
  try {
    const response = await axios.get("/server/contacts/get-all-contacts");

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
      errorMessage || "Get All Contacts failed. Please try again later."
    );
  }
};
