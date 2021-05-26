const {
  CASE_STATUS_TYPES,
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} = require('../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updatePetitionDetailsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.petitionDetails the petition details to update on the case
 * @returns {object} the updated case data
 */
exports.updatePetitionDetailsInteractor = async (
  applicationContext,
  { docketNumber, petitionDetails },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_PETITION_DETAILS)) {
    throw new UnauthorizedError('Unauthorized for editing petition details');
  }

  const editableFields = {
    caseType: petitionDetails.caseType,
    hasVerifiedIrsNotice: petitionDetails.hasVerifiedIrsNotice,
    irsNoticeDate: petitionDetails.irsNoticeDate,
    petitionPaymentDate: petitionDetails.petitionPaymentDate,
    petitionPaymentMethod: petitionDetails.petitionPaymentMethod,
    petitionPaymentStatus: petitionDetails.petitionPaymentStatus,
    petitionPaymentWaivedDate: petitionDetails.petitionPaymentWaivedDate,
    preferredTrialCity: petitionDetails.preferredTrialCity,
    procedureType: petitionDetails.procedureType,
    statistics: petitionDetails.statistics,
  };

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const isPaid = editableFields.petitionPaymentStatus === PAYMENT_STATUS.PAID;
  const isWaived =
    editableFields.petitionPaymentStatus === PAYMENT_STATUS.WAIVED;

  const newCase = new Case(
    {
      ...oldCase,
      ...editableFields,
      petitionPaymentDate: isPaid ? editableFields.petitionPaymentDate : null,
      petitionPaymentMethod: isPaid
        ? editableFields.petitionPaymentMethod
        : null,
      petitionPaymentWaivedDate: isWaived
        ? editableFields.petitionPaymentWaivedDate
        : null,
    },
    { applicationContext },
  );

  if (oldCase.petitionPaymentStatus === PAYMENT_STATUS.UNPAID) {
    if (isPaid) {
      newCase.addDocketEntry(
        new DocketEntry(
          {
            documentTitle: 'Filing Fee Paid',
            documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
            eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
            filingDate: newCase.petitionPaymentDate,
            isFileAttached: false,
            isMinuteEntry: true,
            isOnDocketRecord: true,
            processingStatus: 'complete',
            userId: user.userId,
          },
          { applicationContext },
        ),
      );
    } else if (isWaived) {
      newCase.addDocketEntry(
        new DocketEntry(
          {
            documentTitle: 'Filing Fee Waived',
            documentType: MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
            eventCode: MINUTE_ENTRIES_MAP.filingFeeWaived.eventCode,
            filingDate: newCase.petitionPaymentWaivedDate,
            isFileAttached: false,
            isMinuteEntry: true,
            isOnDocketRecord: true,
            processingStatus: 'complete',
            userId: user.userId,
          },
          { applicationContext },
        ),
      );
    }
  }

  if (
    oldCase.preferredTrialCity !== newCase.preferredTrialCity &&
    (newCase.highPriority ||
      newCase.status === CASE_STATUS_TYPES.generalDocketReadyForTrial) &&
    newCase.preferredTrialCity &&
    !newCase.blocked &&
    (!newCase.automaticBlocked ||
      (newCase.automaticBlocked && newCase.highPriority))
  ) {
    await applicationContext
      .getPersistenceGateway()
      .updateCaseTrialSortMappingRecords({
        applicationContext,
        caseSortTags: newCase.generateTrialSortTags(),
        docketNumber: newCase.validate().toRawObject().docketNumber,
      });
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: newCase,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
