import { Case } from '@shared/business/entities/cases/Case';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { RawUser } from '@shared/business/entities/User';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';

export const updateAssociatedCaseWorker = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, user }: { docketNumber: string; user: RawUser },
): Promise<void> => {
  await applicationContext.getUseCaseHelpers().acquireLock({
    applicationContext,
    identifiers: [`case|${docketNumber}`],
    retries: 10,
    ttl: 900,
    waitTime: 5000,
  });

  if (user.role === ROLES.petitioner) {
    await updatePetitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [docketNumber],
      user,
    });
  }
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    await updatePractitionerCases({
      applicationContext,
      docketNumbersAssociatedWithUser: [docketNumber],
      user,
    });
  }

  await applicationContext.getPersistenceGateway().removeLock({
    applicationContext,
    identifiers: [`case|${docketNumber}`],
  });
};

export const updatePetitionerCases = async ({
  applicationContext,
  docketNumbersAssociatedWithUser,
  user,
}) => {
  const rawCasesToUpdate = await Promise.all(
    docketNumbersAssociatedWithUser.map(docketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  applicationContext.logger.info('updatePetitionerCases', { rawCasesToUpdate });

  const validatedCasesToUpdateInPersistence: (Case | undefined)[] = [];
  for (let rawCaseData of rawCasesToUpdate) {
    validatedCasesToUpdateInPersistence.push(
      await updateCaseEntityAndGenerateChange({
        applicationContext,
        rawCaseData,
        user,
      }),
    );
  }
  const filteredCasesToUpdateInPersistence =
    validatedCasesToUpdateInPersistence.filter(Boolean);

  return Promise.all(
    filteredCasesToUpdateInPersistence.map(caseToUpdate =>
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
        applicationContext,
        caseToUpdate,
      }),
    ),
  );
};

/**
 * updatePractitionerCases
 * for the provided user, update their email address on all cases
 * where they are an IRS practitioner or private practitioner, sending an
 * update to the practitioner for each case updated, as well as a final email when
 * all case updates have been completed.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {string} providers.user the user who is a primary or secondary contact on a case
 * @returns {Promise} resolves upon completion of case updates
 */
export const updatePractitionerCases = async ({
  applicationContext,
  docketNumbersAssociatedWithUser,
  user,
}: {
  applicationContext: IApplicationContext;
  docketNumbersAssociatedWithUser: string[];
  user: any;
}) => {
  const casesToUpdate = await Promise.all(
    docketNumbersAssociatedWithUser.map(docketNumber =>
      applicationContext.getPersistenceGateway().getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      }),
    ),
  );

  const validCasesToUpdate = casesToUpdate
    .map(caseToUpdate => {
      const caseEntity = new Case(caseToUpdate, { applicationContext });
      const practitionerObject = [
        ...caseEntity.privatePractitioners,
        ...caseEntity.irsPractitioners,
      ].find(practitioner => practitioner.userId === user.userId);

      if (!practitionerObject) {
        applicationContext.logger.error(
          `Could not find user|${user.userId} barNumber: ${user.barNumber} on ${caseToUpdate.docketNumber}`,
        );
        return;
      }
      // This updates the case by reference!
      practitionerObject.email = user.email;
      practitionerObject.serviceIndicator =
        SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;

      // we do this again so that it will convert '' to null
      return new Case(caseEntity, { applicationContext }).validate();
    })
    // if practitioner is not found on the case, function exits early and returns `undefined`.
    // if this happens, continue with remaining cases and do not throw exception, but discard
    // any undefined values by filtering for truthy objects.
    .filter(Boolean);

  for (let idx = 0; idx < validCasesToUpdate.length; idx++) {
    const validatedCaseToUpdate = validCasesToUpdate[idx];
    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: validatedCaseToUpdate,
    });
  }

  return validCasesToUpdate;
};

const updateCaseEntityAndGenerateChange = async ({
  applicationContext,
  rawCaseData,
  user,
}: {
  applicationContext: IApplicationContext;
  rawCaseData: Case;
  user: RawUser;
}) => {
  const caseEntity = new Case(rawCaseData, {
    applicationContext,
  });

  const petitionerObject = caseEntity.getPetitionerById(user.userId);
  if (!petitionerObject) {
    applicationContext.logger.error(
      `Could not find user|${user.userId} on ${caseEntity.docketNumber}`,
    );
    return;
  }

  const oldEmail = petitionerObject.email;
  const newData = {
    email: user.email,
    name: petitionerObject.name,
  };

  const oldData = { email: oldEmail };
  petitionerObject.email = user.email;

  if (!Case.isPetitionerRepresented(caseEntity, petitionerObject.contactId)) {
    petitionerObject.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
  }

  const servedParties = aggregatePartiesForService(caseEntity);
  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({ newData, oldData });

  applicationContext.logger.info('updateCaseEntityAndGenerateChange', {
    documentType,
    newData,
    oldData,
  });

  const privatePractitionersRepresentingContact = Case.isPetitionerRepresented(
    caseEntity,
    petitionerObject.contactId,
  );

  if (caseEntity.shouldGenerateNoticesForCase()) {
    const { changeOfAddressDocketEntry } = await applicationContext
      .getUseCaseHelpers()
      .generateAndServeDocketEntry({
        applicationContext,
        caseEntity,
        documentType,
        newData,
        oldData,
        privatePractitionersRepresentingContact,
        servedParties,
        user,
      });
    caseEntity.addDocketEntry(changeOfAddressDocketEntry);
  }

  return caseEntity.validate();
};
