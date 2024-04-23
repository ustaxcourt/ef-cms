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
    await updatePetitionerCase({
      applicationContext,
      docketNumber,
      user,
    });
  }
  if (
    user.role === ROLES.privatePractitioner ||
    user.role === ROLES.irsPractitioner ||
    user.role === ROLES.inactivePractitioner
  ) {
    await updatePractitionerCase({
      applicationContext,
      docketNumber,
      user,
    });
  }

  await applicationContext.getPersistenceGateway().removeLock({
    applicationContext,
    identifiers: [`case|${docketNumber}`],
  });
};

export const updatePetitionerCase = async ({
  applicationContext,
  docketNumber,
  user,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
  user: RawUser;
}): Promise<void> => {
  const rawCaseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseToUpdate = await updateCaseEntityAndGenerateChange({
    applicationContext,
    rawCaseData: rawCaseToUpdate,
    user,
  });

  if (!caseToUpdate) return;

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate,
  });
};

export const updatePractitionerCase = async ({
  applicationContext,
  docketNumber,
  user,
}: {
  applicationContext: ServerApplicationContext;
  docketNumber: string;
  user: any;
}): Promise<void> => {
  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });
  const practitionerObject = [
    ...caseEntity.privatePractitioners,
    ...caseEntity.irsPractitioners,
  ].find(practitioner => practitioner.userId === user.userId);

  if (!practitionerObject) {
    // if practitioner is not found on the case, function exits early and returns `undefined`.
    applicationContext.logger.error(
      `Could not find user|${user.userId} barNumber: ${user.barNumber} on ${caseToUpdate.docketNumber}`,
    );
    return;
  }
  // This updates the case by reference!
  practitionerObject.email = user.email;
  practitionerObject.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;

  // we do this again so that it will convert '' to null
  const validatedCaseToUpdate = new Case(caseEntity, {
    applicationContext,
  }).validate();

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: validatedCaseToUpdate,
  });
};

const updateCaseEntityAndGenerateChange = async ({
  applicationContext,
  rawCaseData,
  user,
}: {
  applicationContext: IApplicationContext;
  rawCaseData: RawCase;
  user: RawUser;
}): Promise<RawCase | undefined> => {
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
