import axios from "axios";
import EnvManager from "../../config/envManager";

const baseUrl = `${EnvManager.BACKEND_URL}/users`;

const getUsers = async () => {
  const response = await axios.get(baseUrl, {
    withCredentials: true,
  });
  return response?.data.users;
};

const getActiveUserSession = async () => {
  try {
    const response = await axios.get(`${baseUrl}/session/active`, {
      withCredentials: true,
    });
    return response?.data;
  } catch (error) {
    return null;
  }
};

const getUserFromSessionStorage = () => {
  if (!sessionStorage.getItem("isUserActive")) return null;
  return {
    name: sessionStorage.getItem("userName"),
    exp: sessionStorage.getItem("userExp"),
    email: sessionStorage.getItem("userEmail"),
    picture: sessionStorage.getItem("userPicture"),
  };
};

const setUserInSessionStorage = (user, isActive) => {
  sessionStorage.setItem("isUserActive", isActive);
  sessionStorage.setItem("userName", user.name);
  sessionStorage.setItem("userExp", user.exp);
  sessionStorage.setItem("userEmail", user.email);
  sessionStorage.setItem("userPicture", user.picture);
};

const didUserActivateSession = async () => {
  const sessionUser = getUserFromSessionStorage();

  if (sessionUser && sessionUser.exp < new Date().getTime()) return sessionUser;
  const user = await getActiveUserSession();
  if (user) {
    setUserInSessionStorage(user, true);
    return user;
  }
  return null;
};

export { getUsers, didUserActivateSession };
