import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { verifyCaseForUser } from '@web-api/persistence/postgres/users/cases/verifyCaseForUser';
import { associateUserWithCase } from '@web-api/persistence/postgres/users/cases/associateUserWithCase';

/**
 * associatePrivatePractitionerToCase
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.docketNumber the docket number of the case
 * @param {Array} params.representing the contact ids the private practitioner is representing
 * @param {object} providers.user the user object for the logged in user
 * @param {object} providers.serviceIndicator the service indicator
 * @returns {Promise<*>} the updated case entity
 */
export const associatePrivatePractitionerToCase = async ({
  applicationContext,
  authorizedUser,
  docketNumber,
  representing = [],
  serviceIndicator,
  user,
}: {
  applicationContext: ServerApplicationContext;
  authorizedUser: AuthUser;
  docketNumber: string;
  serviceIndicator?: string;
  user: RawPractitioner;
  representing: string[];
}): Promise<RawCase> => {
  const isAssociated = await verifyCaseForUser({
    docketNumber,
    userId: user.userId,
  });

  const caseToUpdate = await getCaseByDocketNumber({
    applicationContext,
    docketNumber,
  });
  const caseEntity = new Case(caseToUpdate, {
    authorizedUser,
  });

  const isPrivatePractitionerOnCase = caseToUpdate.privatePractitioners?.some(
    practitioner => practitioner.userId === user.userId,
  );

  if (isAssociated) {
    if (!isPrivatePractitionerOnCase) {
      getDawsonLogger().error(
        `BUG 9323: Private Practitioner with userId: ${user.userId} was already associated with case ${docketNumber} but did not appear in the privatePractitioners array.`,
      );
    }
    return caseEntity.toRawObject();
  }

  await associateUserWithCase({
    docketNumber,
    userId: user.userId,
    representing,
  });

  const { petitioners } = caseEntity;

  petitioners.map(petitioner => {
    if (representing.includes(petitioner.contactId)) {
      petitioner.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_NONE;
    }
  });

  caseEntity.attachPrivatePractitioner(
    new PrivatePractitioner({
      ...user,
      representing,
      serviceIndicator,
    }),
  );

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return caseEntity.toRawObject();
};
