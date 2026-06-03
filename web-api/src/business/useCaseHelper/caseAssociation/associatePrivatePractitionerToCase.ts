import { AuthUser } from '@shared/business/entities/authUser/AuthUser';
import { Case } from '@shared/business/entities/cases/Case';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { RawPractitioner } from '@shared/business/entities/Practitioner';
import { SERVICE_INDICATOR_TYPES } from '@shared/business/entities/EntityConstants';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDawsonLogger } from '@web-api/utilities/logger/getDawsonLogger';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { verifyCaseForUser } from '@web-api/persistence/postgres/cases/userOnCase/verifyCaseForUser';

export const associatePrivatePractitionerToCase = async ({
  authorizedUser,
  docketNumber,
  representing = [],
  serviceIndicator,
  user,
}: {
  authorizedUser: AuthUser;
  docketNumber: string;
  serviceIndicator?: string;
  user: RawPractitioner;
  representing: string[];
}): Promise<void> => {
  const isAssociated = await verifyCaseForUser({
    docketNumber,
    userId: user.userId,
  });

  const caseToUpdate = await getCaseByDocketNumber({
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
    return;
  }

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

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });
};
