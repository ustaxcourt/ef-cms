import { UserOnCaseKysely } from '@web-api/persistence/postgres/cases/userOnCase/schema';

export const transformOpenSearchUserOnCase = (
  userOnCaseData: UserOnCaseKysely | UserOnCaseKysely[],
): string[] => {
  const users = Array.isArray(userOnCaseData)
    ? userOnCaseData
    : [userOnCaseData];
  return users.map(userOnCase => userOnCase.docketNumber);
};


