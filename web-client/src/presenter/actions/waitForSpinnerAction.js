export const waitForSpinnerAction = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
};
