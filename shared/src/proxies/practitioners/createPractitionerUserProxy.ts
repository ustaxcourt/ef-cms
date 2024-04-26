import { post } from '../requests';

export const createPractitionerUserInteractor = (
  applicationContext,
  { user },
): Promise<{ barNumber: string }> => {
  return post({
    applicationContext,
    body: { user },
    endpoint: '/practitioners',
  });
};
