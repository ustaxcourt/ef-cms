export const forgotPasswordInteractor = async (): Promise<{
  bad?: string;
  good?: string;
}> => {
  console.log('this is good');
  const result = { good: 'this is good?' };
  return result;
  // return { bad: 'this is bad' };
};
