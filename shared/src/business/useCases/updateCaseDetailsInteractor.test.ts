import {
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import { MOCK_LOCK } from '../../test/mockLock';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { docketClerkUser } from '@shared/test/mockUsers';
import { updateCaseDetailsInteractor } from './updateCaseDetailsInteractor';

describe('updateCaseDetailsInteractor', () => {
  let mockCase, generalDocketReadyForTrialCase;
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
    mockCase = cloneDeep(MOCK_CASE);
    generalDocketReadyForTrialCase = cloneDeep({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCase);
  });

  it('should throw an error when the user is unauthorized to update a case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCaseDetailsInteractor(applicationContext, {
        caseDetails: {},
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error when the updates to the case make it invalid', async () => {
    await expect(
      updateCaseDetailsInteractor(applicationContext, {
        caseDetails: {
          caseType: undefined,
        },
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should set irsNoticeDate when the updated case has a verified IRS notice', async () => {
    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        hasVerifiedIrsNotice: true,
        irsNoticeDate: '2020-08-28T01:49:58.117Z',
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(result.hasVerifiedIrsNotice).toBe(true);
    expect(result.irsNoticeDate).toBe('2020-08-28T01:49:58.117Z');
  });

  it('should set irsNoticeDate to undefined when the updated case does not have a verified IRS notice', async () => {
    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        hasVerifiedIrsNotice: false,
        irsNoticeDate: '2020-08-28T01:49:58.117Z',
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(result.hasVerifiedIrsNotice).toBe(false);
    expect(result.irsNoticeDate).toBe(undefined);
  });

  it('should call updateCase with the updated case payment information (when unpaid) and return the updated case', async () => {
    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.UNPAID);
  });

  it('should call updateCase with the updated case payment information (when paid) and return the updated case', async () => {
    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        petitionPaymentDate: '2019-11-30T09:10:11.000Z',
        petitionPaymentMethod: 'check',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentDate).toEqual('2019-11-30T09:10:11.000Z');
    expect(result.petitionPaymentMethod).toEqual('check');
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.PAID);
  });

  it('should call updateCase with the updated case payment information (when waived) and return the updated case', async () => {
    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.WAIVED);
    expect(result.petitionPaymentWaivedDate).toEqual(
      '2019-11-30T09:10:11.000Z',
    );
  });

  it('should create a docket entry when the petition payment status was changed from unpaid to waived', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      });

    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
        petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
      },
      docketNumber: mockCase.docketNumber,
    });

    const waivedDocument = result.docketEntries.find(
      entry =>
        entry.documentType === MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
    );

    expect(waivedDocument).toBeTruthy();
  });

  it('should create a docket entry the petition payment status was changed from unpaid to paid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      });

    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        petitionPaymentDate: '2019-11-30T09:10:11.000Z',
        petitionPaymentMethod: 'check',
        petitionPaymentStatus: PAYMENT_STATUS.PAID,
      },
      docketNumber: mockCase.docketNumber,
    });

    const paidDocument = result.docketEntries.find(
      entry =>
        entry.documentType === MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
    );

    expect(paidDocument).toBeTruthy();
  });

  it('should NOT create a docket entry the petition payment status was NOT changed from unpaid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...MOCK_CASE,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      });

    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(result).toMatchObject({
      docketEntries: MOCK_CASE.docketEntries,
    });
  });

  it('should call createCaseTrialSortMappingRecords when the updated case is ready for trial and preferred trial city has been changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(generalDocketReadyForTrialCase);

    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...generalDocketReadyForTrialCase,
        preferredTrialCity: 'Cheyenne, Wyoming',
      },
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.preferredTrialCity).toBe('Cheyenne, Wyoming');
  });

  it('should call createCaseTrialSortMappingRecords when the updated case is high priority and preferred trial city has been changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        highPriority: true,
        highPriorityReason: 'roll out',
      });

    const result = await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...generalDocketReadyForTrialCase,
        preferredTrialCity: 'Cheyenne, Wyoming',
        status: CASE_STATUS_TYPES.rule155,
      },
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(result.preferredTrialCity).toBe('Cheyenne, Wyoming');
  });

  it('should call createCaseTrialSortMappingRecords when the updated case is high priority, automaticBlocked, and preferred trial city has been changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        automaticBlocked: true,
        automaticBlockedDate: '2019-11-30T09:10:11.000Z',
        automaticBlockedReason: 'Pending Item',
        highPriority: true,
        highPriorityReason: 'roll out',
      });

    await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...generalDocketReadyForTrialCase,
        highPriority: true,
        preferredTrialCity: 'Cheyenne, Wyoming',
        status: CASE_STATUS_TYPES.rule155,
      },
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should call createCaseTrialSortMappingRecords when the case type has been changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        caseType: CASE_TYPES_MAP.cdp,
      });

    await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...generalDocketReadyForTrialCase,
        caseType: CASE_TYPES_MAP.deficiency,
      },
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should call createCaseTrialSortMappingRecords when the case procedure type has been changed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        procedureType: 'Regular',
      });

    await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...generalDocketReadyForTrialCase,
        procedureType: 'Small',
      },
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should call createCaseTrialSortMappingRecords when the case procedure type is changed and old case did not need trial sort mapping records because no trial location was selected', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        preferredTrialCity: undefined,
        procedureType: 'Regular',
      });

    await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...generalDocketReadyForTrialCase,
        procedureType: 'Small',
      },
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should NOT call createCaseTrialSortMappingRecords when there are no changes that would alter the trial sort tags', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        procedureType: 'Regular',
      });

    await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...generalDocketReadyForTrialCase,
      },
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .createCaseTrialSortMappingRecords,
    ).not.toHaveBeenCalled();
  });

  it('does not allow fields that do not exist on the editableFields list to be updated on the case', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...generalDocketReadyForTrialCase,
        highPriorityReason: 'roll out',
      });

    await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...generalDocketReadyForTrialCase,
        mailingDate: 'SOME NEW MAILING DATE', // attempting to change a field that does not exist in editableFields
        partyType: 'SOME NEW PARTY TYPE', // attempting to change a field that does not exist in editableFields
        preferredTrialCity: 'Cheyenne, Wyoming',
        status: CASE_STATUS_TYPES.rule155,
      },
      docketNumber: generalDocketReadyForTrialCase.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.mailingDate,
    ).toEqual(MOCK_CASE.mailingDate); // does not change

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[0][0].caseToUpdate.partyType,
    ).toEqual(MOCK_CASE.partyType); // does not change
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      updateCaseDetailsInteractor(applicationContext, {
        caseDetails: {
          ...mockCase,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        },
        docketNumber: mockCase.docketNumber,
      }),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await updateCaseDetailsInteractor(applicationContext, {
      caseDetails: {
        ...mockCase,
        petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
      },
      docketNumber: mockCase.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${MOCK_CASE.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${MOCK_CASE.docketNumber}`],
    });
  });
});
