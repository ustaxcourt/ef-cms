import { verifyPendingCaseForUser } from '@web-api/persistence/postgres/users/cases/verifyPendingCaseForUser';

export const verifyPendingCaseForUserInteractor = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}) => {
  return await verifyPendingCaseForUser({
    docketNumber,
    userId,
  });
};
