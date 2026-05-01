import { verifyPendingCaseForUser } from '@web-api/persistence/postgres/cases/pendingCases/verifyPendingCaseForUser';

export const verifyPendingCaseForUserInteractor = async ({
  docketNumber,
  userId,
}: {
  docketNumber: string;
  userId: string;
}): Promise<boolean> => {
  return await verifyPendingCaseForUser({
    docketNumber,
    userId,
  });
};
