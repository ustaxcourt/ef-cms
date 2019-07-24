exports.removeItem = async ({ key }) => {
  return window.localStorage.removeItem(key);
};
