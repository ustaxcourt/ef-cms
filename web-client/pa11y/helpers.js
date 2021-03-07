const getOnly = urls => {
  const only = urls.filter(url => url.only);
  if (only.length) {
    urls = only;
  }
  return urls;
};

module.exports = {
  getOnly,
};
