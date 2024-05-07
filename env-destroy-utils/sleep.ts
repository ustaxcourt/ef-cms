export const sleepForMilliseconds = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
