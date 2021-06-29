const getOnly = urls => {
  const only = urls.filter(url => url.only);
  if (only.length) {
    urls = only.map(o => ({
      ...o,
      log: {
        debug: console.log,
        error: console.error,
        info: console.log,
      },
    }));
  }
  return urls;
};

module.exports = {
  getOnly,
};
