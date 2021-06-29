const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  UnauthorizedError,
  UnprocessableEntityError,
} = require('../../errors/errors');
const { Case } = require('../entities/cases/Case');
const { CONTACT_TYPES } = require('../entities/EntityConstants');
const { isEmpty } = require('lodash');
const { WorkItem } = require('../entities/WorkItem');

/**
 * saveCaseDetailInternalEditInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseToUpdate the updated case data
 * @returns {object} the updated case data
 */
exports.saveCaseDetailInternalEditInteractor = async (
  applicationContext,
  { caseToUpdate, docketNumber },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.UPDATE_CASE)) {
    throw new UnauthorizedError('Unauthorized for update case');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  if (!caseToUpdate || docketNumber !== caseToUpdate.docketNumber) {
    throw new UnprocessableEntityError();
  }

  const caseRecord = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const editableFields = {
    caseCaption: caseToUpdate.caseCaption,
    caseType: caseToUpdate.caseType,
    docketNumber: caseToUpdate.docketNumber,
    docketNumberSuffix: caseToUpdate.docketNumberSuffix,
    filingType: caseToUpdate.filingType,
    hasVerifiedIrsNotice: caseToUpdate.hasVerifiedIrsNotice,
    irsNoticeDate: caseToUpdate.irsNoticeDate,
    mailingDate: caseToUpdate.mailingDate,
    noticeOfAttachments: caseToUpdate.noticeOfAttachments,
    orderDesignatingPlaceOfTrial: caseToUpdate.orderDesignatingPlaceOfTrial,
    orderForAmendedPetition: caseToUpdate.orderForAmendedPetition,
    orderForAmendedPetitionAndFilingFee:
      caseToUpdate.orderForAmendedPetitionAndFilingFee,
    orderForFilingFee: caseToUpdate.orderForFilingFee,
    orderForOds: caseToUpdate.orderForOds,
    orderForRatification: caseToUpdate.orderForRatification,
    orderToShowCause: caseToUpdate.orderToShowCause,
    partyType: caseToUpdate.partyType,
    petitionPaymentDate: caseToUpdate.petitionPaymentDate,
    petitionPaymentMethod: caseToUpdate.petitionPaymentMethod,
    petitionPaymentStatus: caseToUpdate.petitionPaymentStatus,
    petitionPaymentWaivedDate: caseToUpdate.petitionPaymentWaivedDate,
    preferredTrialCity: caseToUpdate.preferredTrialCity,
    procedureType: caseToUpdate.procedureType,
    receivedAt: caseToUpdate.receivedAt,
    statistics: caseToUpdate.statistics,
  };

  const caseWithFormEdits = {
    ...caseRecord,
    ...editableFields,
    contactPrimary: caseToUpdate.contactPrimary,
    contactSecondary: caseToUpdate.contactSecondary,
    petitioners: undefined,
  };

  const caseEntityWithFormEdits = new Case(caseWithFormEdits, {
    applicationContext,
  });

  if (!isEmpty(caseToUpdate.contactPrimary)) {
    const caseEntityFromCaseRecord = new Case(caseRecord, {
      applicationContext,
    });
    const primaryContactId =
      caseEntityFromCaseRecord.getContactPrimary().contactId;

    caseEntityWithFormEdits.updatePetitioner({
      ...caseToUpdate.contactPrimary,
      contactId: primaryContactId,
      contactType: CONTACT_TYPES.primary,
    });
  }

  if (!isEmpty(caseToUpdate.contactSecondary)) {
    const secondaryContactId =
      caseEntityWithFormEdits.getContactSecondary()?.contactId;

    caseEntityWithFormEdits.updatePetitioner({
      ...caseToUpdate.contactSecondary,
      contactId: secondaryContactId,
      contactType: CONTACT_TYPES.secondary,
    });
  }

  const caseEntity = new Case(caseEntityWithFormEdits, {
    applicationContext,
  });

  if (caseEntity.isPaper) {
    await applicationContext.getUseCaseHelpers().updateInitialFilingDocuments({
      applicationContext,
      authorizedUser,
      caseEntity,
      caseToUpdate,
    });
  } else {
    const petitionDocketEntry = caseEntity.getPetitionDocketEntry();

    const initializeCaseWorkItem = petitionDocketEntry.workItem;

    const workItemEntity = new WorkItem(
      {
        ...initializeCaseWorkItem,
        assigneeId: user.userId,
        assigneeName: user.name,
        caseIsInProgress: true,
      },
      { applicationContext },
    );

    await applicationContext.getPersistenceGateway().saveWorkItem({
      applicationContext,
      workItem: workItemEntity.validate().toRawObject(),
    });
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { applicationContext }).toRawObject();
};
