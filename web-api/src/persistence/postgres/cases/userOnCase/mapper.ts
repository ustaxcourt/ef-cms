import { NewUserOnCaseKysely } from '@web-api/persistence/postgres/cases/userOnCase/schema';

export function toKyselyNewUserOnCase(association: {
  userId: string;
  docketNumber: string;
  representing?: string[];
  serviceIndicator?: string;
}): NewUserOnCaseKysely {
  return {
    userId: association.userId,
    docketNumber: association.docketNumber,
    representing: association.representing
      ? JSON.stringify(association.representing)
      : null,
    serviceIndicator: association.serviceIndicator || null,
  };
}