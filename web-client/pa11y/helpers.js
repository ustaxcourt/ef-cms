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

const setTimeouts = url => {
  return {
    ...url,
    timeout: 60000,
  };
};

module.exports = {
  getOnly,
  setTimeouts,
};
