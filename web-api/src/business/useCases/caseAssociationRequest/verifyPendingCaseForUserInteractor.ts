import { verifyCaseForUser } from '@web-api/persistence/postgres/users/cases/verifyCaseForUser';

export const verifyPendingCaseForUserInteractor = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}) => {
  return await verifyCaseForUser({
    docketNumber,
    userId,
  });
};
