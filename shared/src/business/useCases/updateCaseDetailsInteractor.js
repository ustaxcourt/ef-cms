const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const {
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} = require('../entities/EntityConstants');
const { Case } = require('../entities/cases/Case');
const { DocketEntry } = require('../entities/DocketEntry');
const { UnauthorizedError } = require('../../errors/errors');

/**
 * updateCaseDetailsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseDetails the case details to update on the case
 * @returns {object} the updated case data
 */
exports.updateCaseDetailsInteractor = async (
  applicationContext,
  { caseDetails, docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.EDIT_CASE_DETAILS)) {
    throw new UnauthorizedError('Unauthorized for editing case details');
  }

  const editableFields = {
    caseType: caseDetails.caseType,
    hasVerifiedIrsNotice: caseDetails.hasVerifiedIrsNotice,
    irsNoticeDate: caseDetails.irsNoticeDate,
    petitionPaymentDate: caseDetails.petitionPaymentDate,
    petitionPaymentMethod: caseDetails.petitionPaymentMethod,
    petitionPaymentStatus: caseDetails.petitionPaymentStatus,
    petitionPaymentWaivedDate: caseDetails.petitionPaymentWaivedDate,
    preferredTrialCity: caseDetails.preferredTrialCity,
    procedureType: caseDetails.procedureType,
    statistics: caseDetails.statistics,
  };

  const oldCase = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({ applicationContext, docketNumber });

  const isPaid = editableFields.petitionPaymentStatus === PAYMENT_STATUS.PAID;
  const isWaived =
    editableFields.petitionPaymentStatus === PAYMENT_STATUS.WAIVED;

  const newCaseEntity = new Case(
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
      newCaseEntity.addDocketEntry(
        new DocketEntry(
          {
            documentTitle: 'Filing Fee Paid',
            documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
            eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
            filingDate: newCaseEntity.petitionPaymentDate,
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
      newCaseEntity.addDocketEntry(
        new DocketEntry(
          {
            documentTitle: 'Filing Fee Waived',
            documentType: MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
            eventCode: MINUTE_ENTRIES_MAP.filingFeeWaived.eventCode,
            filingDate: newCaseEntity.petitionPaymentWaivedDate,
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

  if (newCaseEntity.getShouldHaveTrialSortMappingRecords()) {
    const oldCaseEntity = new Case(oldCase, { applicationContext });
    const oldTrialSortTag = oldCaseEntity.generateTrialSortTags();
    const newTrialSortTag = newCaseEntity.generateTrialSortTags();

    // The nonHybrid sort tag will be comprised of the trial city, procedure type, and case type
    // so we can simply check if this tag changes to determine if new records should be created
    // rather than looking at the changed fields directly
    if (oldTrialSortTag.nonHybrid !== newTrialSortTag.nonHybrid) {
      await applicationContext
        .getPersistenceGateway()
        .createCaseTrialSortMappingRecords({
          applicationContext,
          caseSortTags: newCaseEntity.generateTrialSortTags(),
          docketNumber: newCaseEntity.validate().toRawObject().docketNumber,
        });
    }
  }

  const updatedCase = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: newCaseEntity,
    });

  return new Case(updatedCase, { applicationContext }).validate().toRawObject();
};
