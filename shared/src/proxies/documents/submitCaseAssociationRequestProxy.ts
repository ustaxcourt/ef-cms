import { put } from '../requests';

export const submitCaseAssociationRequestInteractor = (
  applicationContext,
  {
    docketNumber,
    filers,
    userId,
  }: {
    docketNumber: string;
    userId: string;
    filers?: string[];
  },
): Promise<{ docketNumber: string } | undefined> => {
  return put({
    applicationContext,
    body: {
      docketNumber,
      filers,
    },
    endpoint: `/users/${userId}/case/${docketNumber}`,
  });
};
