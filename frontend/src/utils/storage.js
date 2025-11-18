// src/utils/storage.js
export const setToken = (token) => sessionStorage.setItem("access_token", token);

export const getToken = () => sessionStorage.getItem("access_token");

export const clearToken = () => sessionStorage.removeItem("access_token");

export const setUser = (user) => localStorage.setItem("user", JSON.stringify(user));

export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export const clearUser = () => localStorage.removeItem("user");
