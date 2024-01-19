import { ServerApplicationContext } from '@web-api/applicationContext';

export const forgotPasswordInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    email,
  }: {
    email: string;
  },
): Promise<{
  bad?: string;
  good?: string;
}> => {
  console.log('this is good', email);
  await applicationContext.getCognito();
  const result = { good: `this is good? ${email}` };
  return result;
  // return { bad: 'this is bad' };
};
