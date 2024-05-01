import { Case } from '../entities/cases/Case';
import { DocketEntry } from '../entities/DocketEntry';
import {
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} from '../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 * updateCaseDetails
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case to update
 * @param {object} providers.caseDetails the case details to update on the case
 * @returns {object} the updated case data
 */
export const updateCaseDetails = async (
  applicationContext: IApplicationContext,
  { caseDetails, docketNumber }: { caseDetails: any; docketNumber: string },
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
      irsNoticeDate: editableFields.hasVerifiedIrsNotice
        ? editableFields.irsNoticeDate
        : undefined,
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
      const filingFeePaidEntry = new DocketEntry(
        {
          documentTitle: 'Filing Fee Paid',
          documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
          eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
          filingDate: newCaseEntity.petitionPaymentDate,
          isFileAttached: false,
          isOnDocketRecord: true,
          processingStatus: 'complete',
        },
        { applicationContext },
      );

      filingFeePaidEntry.setFiledBy(user);

      newCaseEntity.addDocketEntry(filingFeePaidEntry);
    } else if (isWaived) {
      const filingFeeWaivedEntry = new DocketEntry(
        {
          documentTitle: 'Filing Fee Waived',
          documentType: MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
          eventCode: MINUTE_ENTRIES_MAP.filingFeeWaived.eventCode,
          filingDate: newCaseEntity.petitionPaymentWaivedDate,
          isFileAttached: false,
          isOnDocketRecord: true,
          processingStatus: 'complete',
        },
        { applicationContext },
      );

      filingFeeWaivedEntry.setFiledBy(user);

      newCaseEntity.addDocketEntry(filingFeeWaivedEntry);
    }
  }

  if (newCaseEntity.getShouldHaveTrialSortMappingRecords()) {
    const oldCaseEntity = new Case(oldCase, { applicationContext });
    const oldTrialSortTag = oldCaseEntity.getShouldHaveTrialSortMappingRecords()
      ? oldCaseEntity.generateTrialSortTags()
      : { nonHybrid: undefined };
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

export const updateCaseDetailsInteractor = withLocking(
  updateCaseDetails,
  (_applicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
