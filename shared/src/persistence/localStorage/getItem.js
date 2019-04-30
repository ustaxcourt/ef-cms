exports.getItem = async ({ key }) => {
  return JSON.parse(window.localStorage.getItem(key) || 'null');
};
