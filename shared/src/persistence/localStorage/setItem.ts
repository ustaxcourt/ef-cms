exports.setItem = ({ key, value }) =>
  window.localStorage.setItem(key, JSON.stringify(value));
