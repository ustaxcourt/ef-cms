/**
 * Reloads the page
 */
export const reloadPageAction = () => {
  // we wrap this in a timeout because sometimes the page can refresh faster
  // than cerebral can finish writing to localStorage
  return new Promise(resolve => {
    setTimeout(() => {
      window.location.reload();
      resolve();
    }, 100);
  });
};
