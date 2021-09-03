const {
  aggregatePartiesForService,
} = require('../utilities/aggregatePartiesForService');
const {
  Case,
  getPetitionerById,
  getPractitionersRepresenting,
} = require('../entities/cases/Case');
const {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} = require('../entities/EntityConstants');
const {
  createDocketEntryAndWorkItem,
} = require('../useCaseHelper/service/createChangeItems');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { defaults, pick } = require('lodash');
const { NotFoundError, UnauthorizedError } = require('../../errors/errors');

const getIsUserAuthorized = ({ oldCase, updatedPetitionerData, user }) => {
  let isRepresentingCounsel = false;
  if (user.role === ROLES.privatePractitioner) {
    const practitioners = getPractitionersRepresenting(
      oldCase,
      updatedPetitionerData.contactId,
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

/**
 * updatePetitionerInformationInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {string} providers.updatedPetitionerData the updatedPetitionerData to update
 * @returns {object} the updated case data
 */
const updatePetitionerInformationInteractor = async (
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

  const petitionerInfoChange = applicationContext
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
    hasEAccess: oldCaseContact.hasEAccess,
    isAddressSealed: oldCaseContact.isAddressSealed,
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

  let petitionerChangeDocs;
  let serviceResults;

  const updatedCaseContact = caseEntity.getPetitionerById(
    updatedPetitionerData.contactId,
  );

  if (petitionerInfoChange && !updatedCaseContact.isAddressSealed) {
    const partyWithPaperService = caseEntity.hasPartyWithServiceType(
      SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    const privatePractitionersRepresentingContact =
      caseEntity.isUserIdRepresentedByPrivatePractitioner(
        updatedCaseContact.contactId,
      );

    petitionerChangeDocs = await createDocketEntryAndWorkItem({
      applicationContext,
      caseEntity,
      change: petitionerInfoChange,
      editableFields,
      oldCaseContact,
      partyWithPaperService,
      privatePractitionersRepresentingContact,
      servedParties,
      user,
    });

    serviceResults = await applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf({
        applicationContext,
        caseEntity,
        docketEntryId:
          petitionerChangeDocs.changeOfAddressDocketEntry.docketEntryId,
      });
  }

  if (
    updatedPetitionerData.updatedEmail &&
    updatedPetitionerData.updatedEmail !== oldCaseContact.email
  ) {
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
          name: updatedCaseContact.name,
        });
    } else {
      caseEntity = await applicationContext
        .getUseCaseHelpers()
        .addExistingUserToCase({
          applicationContext,
          caseEntity,
          contactId: updatedPetitionerData.contactId,
          email: updatedPetitionerData.updatedEmail,
          name: updatedCaseContact.name,
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
    paperServicePdfUrl: serviceResults?.url,
    updatedCase,
  };
};

module.exports = {
  getIsUserAuthorized,
  updatePetitionerInformationInteractor,
};
