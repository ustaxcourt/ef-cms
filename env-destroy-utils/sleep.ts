export const sleepForMilliseconds = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
