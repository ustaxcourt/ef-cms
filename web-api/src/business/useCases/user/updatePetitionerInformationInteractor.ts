import {
  AuthUser,
  UnknownAuthUser,
  isAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import {
  CASE_STATUS_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import {
  Case,
  getPetitionerById,
  getPractitionersRepresenting,
} from '@shared/business/entities/cases/Case';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { defaults, pick } from 'lodash';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { generateAndServeDocketEntry } from '@web-api/business/useCaseHelper/service/createChangeItems';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';

export const getIsUserAuthorized = ({
  petitionerCaseRaw,
  updatedPetitionerData,
  user,
}) => {
  let isRepresentingCounsel = false;
  if (user.role === ROLES.privatePractitioner) {
    const practitioners = getPractitionersRepresenting(
      petitionerCaseRaw,
      updatedPetitionerData?.contactId,
    );

    isRepresentingCounsel = practitioners?.find(
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
  authorizedUser,
  caseEntity,
  petitionerOnCase,
  user,
  userHasAnEmail,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: any;
  petitionerOnCase: any;
  user: any;
  userHasAnEmail: any;
  authorizedUser: AuthUser;
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
    await generateAndServeDocketEntry({
      applicationContext,
      authorizedUser,
      caseEntity,
      docketMeta: undefined,
      documentType,
      newData,
      oldData,
      privatePractitionersRepresentingContact,
      servedParties,
      user,
    });
  }

  return caseEntity.validate();
};

// this interactor is invoked when an internal user updates the petitioner information from the parties tab.
export const updatePetitionerInformation = async (
  applicationContext: ServerApplicationContext,
  { docketNumber, updatedPetitionerData },
  authorizedUser: UnknownAuthUser,
): Promise<{
  docketNumber: string;
}> => {
  if (!isAuthUser(authorizedUser)) {
    throw new Error(
      'User attempting to update petitioner information is not an auth user',
    );
  }

  const petitionerCaseRaw = await getCaseByDocketNumber({
    docketNumber,
  });

  if (!petitionerCaseRaw) {
    throw new Error(`Case with docket number ${docketNumber} was not found`);
  }

  if (petitionerCaseRaw.status === CASE_STATUS_TYPES.new) {
    throw new Error(
      `Case with docket number ${docketNumber} has not been served`,
    );
  }

  const hasAuthorization = getIsUserAuthorized({
    petitionerCaseRaw,
    updatedPetitionerData,
    user: authorizedUser,
  });

  if (!hasAuthorization) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const existingPetitionerInfo = getPetitionerById(
    petitionerCaseRaw,
    updatedPetitionerData.contactId,
  );

  if (!existingPetitionerInfo) {
    throw new NotFoundError(
      `Case contact with id ${updatedPetitionerData.contactId} was not found on the case`,
    );
  }

  const { updatedEmail } = updatedPetitionerData;

  const { petitioners } = petitionerCaseRaw;

  const contactIdArray = petitioners.map(p => p.contactId);

  // Returns as object {id#: email}, will put values into an array
  const allUsers =
    (await applicationContext.getUseCases().getUsersPendingEmailInteractor(
      {
        userIds: contactIdArray,
      },
      authorizedUser,
    )) || {};

  const allPendingEmails: string[] = Object.values(allUsers);

  const pendingMatchesUpdated: boolean = allPendingEmails
    .map(email => (email || '').toLowerCase())
    .includes((updatedEmail || '').toLowerCase());

  if (allPendingEmails.length > 0 && updatedEmail && pendingMatchesUpdated) {
    throw new Error(`Email ${updatedEmail} is pending for another petitioner`);
  }

  const currentMatchesUpdated = petitionerCaseRaw.petitioners
    .map(p => (p.email || '').toLowerCase())
    .includes((updatedEmail || '').toLowerCase());

  if (updatedEmail && currentMatchesUpdated) {
    throw new Error(
      `Email ${updatedPetitionerData.updatedEmail} is already in use by another petitioner`,
    );
  }

  const editableFields = pick(
    defaults(updatedPetitionerData, {
      additionalName: undefined,
      address2: undefined,
      address3: undefined,
      paperPetitionEmail: undefined,
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
      'paperPetitionEmail',
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
      oldData: existingPetitionerInfo,
    });
  const hasPetitionerInfoChanged = !!documentTypeToGenerate;

  const petitionerCase = new Case(
    {
      ...petitionerCaseRaw,
    },
    { authorizedUser },
  );

  petitionerCase.updatePetitioner({
    updatedPetitioner: {
      contactId: existingPetitionerInfo.contactId,
      email: existingPetitionerInfo.email,
      hasConsentedToElectronicService:
        existingPetitionerInfo.hasConsentedToElectronicService,
      hasElectronicAccess: existingPetitionerInfo.hasElectronicAccess,
      isAddressSealed: existingPetitionerInfo.isAddressSealed,
      sealedAndUnavailable: existingPetitionerInfo.sealedAndUnavailable,
      ...editableFields,
    },
  });

  //send back through the constructor so the contacts are created with the contact constructor
  let caseEntity = new Case(
    { ...petitionerCase.toRawObject() },
    { authorizedUser },
  ).validate();

  const servedParties = aggregatePartiesForService(caseEntity);

  const updatedCaseContact = caseEntity.getPetitionerById(
    updatedPetitionerData.contactId,
  );

  const updateAddressOrPhone =
    hasPetitionerInfoChanged &&
    !updatedCaseContact.isAddressSealed &&
    caseEntity.shouldGenerateNoticesForCase();

  if (updateAddressOrPhone) {
    const privatePractitionersRepresentingContact =
      Case.isPetitionerRepresented(
        caseEntity,
        existingPetitionerInfo.contactId,
      );

    await generateAndServeDocketEntry({
      applicationContext,
      authorizedUser,
      caseEntity,
      docketMeta: undefined,
      documentType: documentTypeToGenerate,
      newData: editableFields,
      oldData: existingPetitionerInfo,
      privatePractitionersRepresentingContact,
      servedParties,
      user: authorizedUser,
    });
  }

  const shouldUpdateEmailAddress =
    updatedPetitionerData.updatedEmail &&
    updatedPetitionerData.updatedEmail !== existingPetitionerInfo.email;

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
          authorizedUser,
          caseEntity,
          contactId: updatedPetitionerData.contactId,
          email: updatedPetitionerData.updatedEmail,
          name: existingPetitionerInfo.name,
        });
    } else {
      const contactId = await applicationContext
        .getUseCaseHelpers()
        .addExistingUserToCase({
          applicationContext,
          authorizedUser,
          caseEntity,
          contactId: updatedPetitionerData.contactId,
          email: updatedPetitionerData.updatedEmail,
          name: existingPetitionerInfo.name,
        });

      updatedCaseContact.oldEmail = existingPetitionerInfo.email;
      updatedCaseContact.newEmail = updatedPetitionerData.updatedEmail;

      const userToUpdate = await getUserById({
        userId: contactId,
      });

      if (!userToUpdate) {
        throw new NotFoundError(
          `User not found with user id ${authorizedUser.userId}`,
        );
      }

      await updateCaseEntityAndGenerateChange({
        applicationContext,
        authorizedUser,
        caseEntity,
        petitionerOnCase: updatedCaseContact,
        user: authorizedUser,
        userHasAnEmail: userToUpdate.email,
      });
    }
  }

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  return {
    docketNumber,
  };
};

export const updatePetitionerInformationInteractor = withLocking(
  updatePetitionerInformation,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
