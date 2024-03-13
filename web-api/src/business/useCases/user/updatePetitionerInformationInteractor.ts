import {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  Case,
  getPetitionerById,
  getPractitionersRepresenting,
} from '../../../../../shared/src/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { aggregatePartiesForService } from '../../../../../shared/src/business/utilities/aggregatePartiesForService';
import { defaults, pick } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

export const getIsUserAuthorized = ({
  oldCase,
  updatedPetitionerData,
  user,
}) => {
  let isRepresentingCounsel = false;
  if (user.role === ROLES.privatePractitioner) {
    const practitioners = getPractitionersRepresenting(
      oldCase,
      updatedPetitionerData?.contactId,
    );

    isRepresentingCounsel = practitioners.find(
      practitioner => practitioner.userId === user.userId,
    );
  }

  let isCurrentPetitioner = false;
  if (user.role === ROLES.petitioner) {
    isCurrentPetitioner = updatedPetitionerData?.contactId === user.userId;
  }

  return (
    isRepresentingCounsel ||
    isCurrentPetitioner ||
    isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITIONER_INFO)
  );
};

const updateCaseEntityAndGenerateChange = async ({
  applicationContext,
  caseEntity,
  petitionerOnCase,
  user,
  userHasAnEmail,
}) => {
  const newData = {
    email: petitionerOnCase.newEmail,
    name: petitionerOnCase.name,
  };
  const oldData = { email: petitionerOnCase.oldEmail };

  const servedParties = aggregatePartiesForService(caseEntity);

  const privatePractitionersRepresentingContact = Case.isPetitionerRepresented(
    caseEntity,
    petitionerOnCase.contactId,
  );

  if (!privatePractitionersRepresentingContact) {
    petitionerOnCase.serviceIndicator = SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
  }

  const documentType = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({ newData, oldData });

  if (userHasAnEmail && caseEntity.shouldGenerateNoticesForCase()) {
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

/**
 * updatePetitionerInformation
 *
 * this interactor is invoked when an internal user updates the petitioner information from the parties tab.
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {string} providers.updatedPetitionerData the updatedPetitionerData to update
 * @returns {object} the updated case data
 */
export const updatePetitionerInformation = async (
  applicationContext,
  { docketNumber, updatedPetitionerData },
) => {
  const user = applicationContext.getCurrentUser();

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const hasAuthorization = getIsUserAuthorized({
    oldCase,
    updatedPetitionerData,
    user,
  });

  if (!hasAuthorization) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  if (oldCase.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docketNumber ${oldCase.docketNumber} has not been served`,
    );
  }
  const oldCaseContact = getPetitionerById(
    oldCase,
    updatedPetitionerData.contactId,
  );

  if (!oldCaseContact) {
    throw new NotFoundError(
      `Case contact with id ${updatedPetitionerData.contactId} was not found on the case`,
    );
  }

  const editableFields = pick(
    defaults(updatedPetitionerData, {
      additionalName: undefined,
      address2: undefined,
      address3: undefined,
      title: undefined,
    }),
    [
      'address1',
      'address2',
      'address3',
      'city',
      'contactType',
      'country',
      'countryType',
      'name',
      'phone',
      'postalCode',
      'additionalName',
      'serviceIndicator',
      'state',
    ],
  );

  const documentTypeToGenerate = applicationContext
    .getUtilities()
    .getDocumentTypeForAddressChange({
      newData: editableFields,
      oldData: oldCaseContact,
    });

  const caseToUpdateContacts = new Case(
    {
      ...oldCase,
    },
    { applicationContext },
  );

  caseToUpdateContacts.updatePetitioner({
    additionalName: oldCaseContact.additionalName,
    contactId: oldCaseContact.contactId,
    contactType: oldCaseContact.contactType,
    email: oldCaseContact.email,
    hasConsentedToEService: oldCaseContact.hasConsentedToEService,
    hasEAccess: oldCaseContact.hasEAccess,
    isAddressSealed: oldCaseContact.isAddressSealed,
    paperPetitionEmail: oldCaseContact.paperPetitionEmail,
    sealedAndUnavailable: oldCaseContact.sealedAndUnavailable,
    ...editableFields,
  });

  //send back through the constructor so the contacts are created with the contact constructor
  let caseEntity = new Case(
    {
      ...caseToUpdateContacts.toRawObject(),
    },
    { applicationContext },
  ).validate();

  const servedParties = aggregatePartiesForService(caseEntity);

  let serviceUrl;

  const updatedCaseContact = caseEntity.getPetitionerById(
    updatedPetitionerData.contactId,
  );

  const hasPetitionerInfoChanged = !!documentTypeToGenerate;

  const updateAddressOrPhone =
    hasPetitionerInfoChanged &&
    !updatedCaseContact.isAddressSealed &&
    caseEntity.shouldGenerateNoticesForCase();

  if (updateAddressOrPhone) {
    const privatePractitionersRepresentingContact =
      Case.isPetitionerRepresented(caseEntity, oldCaseContact.contactId);

    const newData = editableFields;
    const oldData = oldCaseContact;

    const { url } = await applicationContext
      .getUseCaseHelpers()
      .generateAndServeDocketEntry({
        applicationContext,
        caseEntity,
        documentType: documentTypeToGenerate,
        newData,
        oldData,
        privatePractitionersRepresentingContact,
        servedParties,
        user,
      });
    serviceUrl = url;
  }

  const shouldUpdateEmailAddress =
    updatedPetitionerData.updatedEmail &&
    updatedPetitionerData.updatedEmail !== oldCaseContact.email;

  if (shouldUpdateEmailAddress) {
    const isEmailAvailable = await applicationContext
      .getPersistenceGateway()
      .isEmailAvailable({
        applicationContext,
        email: updatedPetitionerData.updatedEmail,
      });
    if (isEmailAvailable) {
      caseEntity = await applicationContext
        .getUseCaseHelpers()
        .createUserForContact({
          applicationContext,
          caseEntity,
          contactId: updatedPetitionerData.contactId,
          email: updatedPetitionerData.updatedEmail,
          name: oldCaseContact.name,
        });
    } else {
      const contactId = await applicationContext
        .getUseCaseHelpers()
        .addExistingUserToCase({
          applicationContext,
          caseEntity,
          contactId: updatedPetitionerData.contactId,
          email: updatedPetitionerData.updatedEmail,
          name: oldCaseContact.name,
        });

      oldCaseContact.oldEmail = oldCaseContact.email;
      oldCaseContact.newEmail = updatedPetitionerData.updatedEmail;
      oldCaseContact.contactId = contactId;

      const userToUpdate = await applicationContext
        .getPersistenceGateway()
        .getUserById({
          applicationContext,
          userId: oldCaseContact.contactId,
        });

      await updateCaseEntityAndGenerateChange({
        applicationContext,
        caseEntity,
        petitionerOnCase: oldCaseContact,
        user,
        userHasAnEmail: userToUpdate.email,
      });
    }
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return {
    paperServiceParties: servedParties.paper,
    paperServicePdfUrl: serviceUrl,
    updatedCase,
  };
};

export const updatePetitionerInformationInteractor = withLocking(
  updatePetitionerInformation,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
