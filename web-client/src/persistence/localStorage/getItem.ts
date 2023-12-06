export const getItem = ({ key }) =>
  JSON.parse(window.localStorage.getItem(key) || 'null');
