import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/messages/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import { tryGetLock as tryGetLockMock } from '@web-api/persistence/postgres/utils/operation/tryGetLock';
import { releaseLock as releaseLockMock } from '@web-api/persistence/postgres/utils/operation/releaseLock';
import { hashLockId } from '@web-api/persistence/postgres/utils/mutex';
import {
  CASE_STATUS_TYPES,
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
} from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import {
  ServiceUnavailableError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import { applicationContext } from '../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { updateCaseDetailsInteractor } from './updateCaseDetailsInteractor';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

describe('updateCaseDetailsInteractor', () => {
  let mockCase, generalDocketReadyForTrialCase;

  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLock = jest.mocked(tryGetLockMock);
  const releaseLock = jest.mocked(releaseLockMock);

  beforeEach(() => {
    mockCase = cloneDeep(MOCK_CASE);
    generalDocketReadyForTrialCase = cloneDeep({
      ...MOCK_CASE,
      status: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    getCaseByDocketNumber.mockResolvedValue(mockCase);
  });

  it('should throw an error when the user is unauthorized to update a case', async () => {
    await expect(
      updateCaseDetailsInteractor(
        applicationContext,
        {
          caseDetails: {},
          docketNumber: mockCase.docketNumber,
        },
        mockPetitionerUser,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should throw a validation error when the updates to the case make it invalid', async () => {
    await expect(
      updateCaseDetailsInteractor(
        applicationContext,
        {
          caseDetails: {
            caseType: undefined,
          },
          docketNumber: mockCase.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should set irsNoticeDate when the updated case has a verified IRS notice', async () => {
    const result = await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          hasVerifiedIrsNotice: true,
          irsNoticeDate: '2020-08-28T01:49:58.117Z',
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result.hasVerifiedIrsNotice).toBe(true);
    expect(result.irsNoticeDate).toBe('2020-08-28T01:49:58.117Z');
  });

  it('should set irsNoticeDate to undefined when the updated case does not have a verified IRS notice', async () => {
    const result = await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          hasVerifiedIrsNotice: false,
          irsNoticeDate: '2020-08-28T01:49:58.117Z',
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result.hasVerifiedIrsNotice).toBe(false);
    expect(result.irsNoticeDate).toBe(undefined);
  });

  it('should call updateCase with the updated case payment information (when unpaid) and return the updated case', async () => {
    const result = await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.UNPAID);
  });

  it('should call updateCase with the updated case payment information (when paid) and return the updated case', async () => {
    const result = await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          petitionPaymentDate: '2019-11-30T09:10:11.000Z',
          petitionPaymentMethod: 'check',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(result.petitionPaymentWaivedDate).toBe(null);
    expect(result.petitionPaymentDate).toEqual('2019-11-30T09:10:11.000Z');
    expect(result.petitionPaymentMethod).toEqual('check');
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.PAID);
  });

  it('should call updateCase with the updated case payment information (when waived) and return the updated case', async () => {
    const result = await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(result.petitionPaymentDate).toBe(null);
    expect(result.petitionPaymentMethod).toBe(null);
    expect(result.petitionPaymentStatus).toEqual(PAYMENT_STATUS.WAIVED);
    expect(result.petitionPaymentWaivedDate).toEqual(
      '2019-11-30T09:10:11.000Z',
    );
  });

  it('should create a docket entry when the petition payment status was changed from unpaid to waived', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...mockCase,
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
    });

    const result = await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
          petitionPaymentWaivedDate: '2019-11-30T09:10:11.000Z',
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    const waivedDocument = result.docketEntries.find(
      entry =>
        entry.documentType === MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
    );

    expect(waivedDocument).toBeTruthy();
  });

  it('should create a docket entry the petition payment status was changed from unpaid to paid', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
    });

    const result = await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          petitionPaymentDate: '2019-11-30T09:10:11.000Z',
          petitionPaymentMethod: 'check',
          petitionPaymentStatus: PAYMENT_STATUS.PAID,
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    const paidDocument = result.docketEntries.find(
      entry =>
        entry.documentType === MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
    );

    expect(paidDocument).toBeTruthy();
  });

  it('should NOT create a docket entry the petition payment status was NOT changed from unpaid', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...MOCK_CASE,
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
    });

    const result = await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(result).toMatchObject({
      docketEntries: MOCK_CASE.docketEntries,
    });
  });

  it('does not allow fields that do not exist on the editableFields list to be updated on the case', async () => {
    getCaseByDocketNumber.mockResolvedValue({
      ...generalDocketReadyForTrialCase,
      highPriorityReason: 'roll out',
    });

    await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...generalDocketReadyForTrialCase,
          mailingDate: 'SOME NEW MAILING DATE', // attempting to change a field that does not exist in editableFields
          partyType: 'SOME NEW PARTY TYPE', // attempting to change a field that does not exist in editableFields
          preferredTrialCity: 'Cheyenne, Wyoming',
          status: CASE_STATUS_TYPES.rule155,
        },
        docketNumber: generalDocketReadyForTrialCase.docketNumber,
      },
      mockDocketClerkUser,
    );

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
    tryGetLock.mockResolvedValueOnce(false);

    await expect(
      updateCaseDetailsInteractor(
        applicationContext,
        {
          caseDetails: {
            ...mockCase,
            petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
          },
          docketNumber: mockCase.docketNumber,
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(getCaseByDocketNumber).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await updateCaseDetailsInteractor(
      applicationContext,
      {
        caseDetails: {
          ...mockCase,
          petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
        },
        docketNumber: mockCase.docketNumber,
      },
      mockDocketClerkUser,
    );

    expect(tryGetLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );

    expect(releaseLock.mock.calls[0][1]).toEqual(
      hashLockId(`case|${MOCK_CASE.docketNumber}`),
    );
  });
});
