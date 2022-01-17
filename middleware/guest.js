export default (store) => {
  if (store.isAuthenticated) {
    return "/";
  }

  return false;
};
