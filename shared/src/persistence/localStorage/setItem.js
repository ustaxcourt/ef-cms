exports.setItem = async ({ key, value }) => {
  return window.localStorage.setItem(key, JSON.stringify(value));
};
