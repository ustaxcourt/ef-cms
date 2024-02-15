export const delay = async (timeToWait: number): Promise<void> => {
  return await new Promise(resolve => setTimeout(resolve, timeToWait));
};
