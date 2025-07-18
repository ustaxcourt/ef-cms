import {
  NewUserOnCaseKysely,
  UserOnCaseAssociation,
} from '@web-api/persistence/postgres/cases/userOnCase/schema';

export function toKyselyNewUserOnCase(
  association: UserOnCaseAssociation,
): NewUserOnCaseKysely {
  return {
    userId: association.userId,
    docketNumber: association.docketNumber,
    representing: association.representing
      ? JSON.stringify(association.representing)
      : null,
    serviceIndicator: association.serviceIndicator || null,
    actingAsRole: association.actingAsRole,
  };
}
