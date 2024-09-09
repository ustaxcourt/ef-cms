import { CONTACT_TYPES } from '../entities/EntityConstants';
import { Case } from '../entities/cases/Case';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import {
  UnauthorizedError,
  UnprocessableEntityError,
} from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { WorkItem } from '../entities/WorkItem';
import { isEmpty } from 'lodash';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';

/**
 * saveCaseDetailInternalEdit
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseToUpdate the updated case data
 * @returns {object} the updated case data
 */
export const saveCaseDetailInternalEdit = async (
  applicationContext: ServerApplicationContext,
  { caseToUpdate, docketNumber },
  authorizedUser: UnknownAuthUser,
) => {
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

  const originalCaseEntity = new Case(caseRecord, { authorizedUser });

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
    orderForCds: caseToUpdate.orderForCds,
    orderForFilingFee: caseToUpdate.orderForFilingFee,
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

  if (!originalCaseEntity.isPaper) {
    editableFields.receivedAt = originalCaseEntity.receivedAt;
  }

  const caseWithFormEdits = {
    ...caseRecord,
    ...editableFields,
    contactPrimary: caseToUpdate.contactPrimary,
    contactSecondary: caseToUpdate.contactSecondary,
    petitioners: undefined,
  };

  const caseEntityWithFormEdits = new Case(caseWithFormEdits, {
    authorizedUser,
  });

  if (!isEmpty(caseToUpdate.contactPrimary)) {
    const primaryContactId = originalCaseEntity.getContactPrimary().contactId;

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
  } else if (originalCaseEntity.getContactSecondary()) {
    const originalSecondaryContactId =
      originalCaseEntity.getContactSecondary().contactId;

    await applicationContext
      .getUseCaseHelpers()
      .removeCounselFromRemovedPetitioner({
        applicationContext,
        authorizedUser,
        caseEntity: caseEntityWithFormEdits,
        petitionerContactId: originalSecondaryContactId,
      });
  }

  const caseEntity = new Case(caseEntityWithFormEdits, {
    authorizedUser,
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
        trialDate: caseEntity.trialDate,
        trialLocation: caseEntity.trialLocation,
      },
      { caseEntity },
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
      authorizedUser,
      caseToUpdate: caseEntity,
    });

  return new Case(updatedCase, { authorizedUser }).toRawObject();
};

export const saveCaseDetailInternalEditInteractor = withLocking(
  saveCaseDetailInternalEdit,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
