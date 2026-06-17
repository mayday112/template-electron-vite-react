export const checkUserLogin = async (email, password) => {
  const user = await window.api.checkLogin({ email, password });
  return user;
};

export const checkUser = async () => {
  const user = await window.api.checkUser();
  console.log("user: ", user);
  return user;
};

export const logout = async () => {
  const user = await window.api.logout();
  return user;
};
