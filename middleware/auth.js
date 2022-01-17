export default (store) => {
  if (!store.isAuthenticated) {
    return "/user/login";
  }

  return false;
};
