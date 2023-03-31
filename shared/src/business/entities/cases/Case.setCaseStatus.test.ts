import {
  CASE_STATUS_TYPES,
  CHIEF_JUDGE,
  CLOSED_CASE_STATUSES,
} from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';
import { createISODateString } from '../../utilities/DateHandler';

jest.mock('../../utilities/DateHandler', () => {
  const originalModule = jest.requireActual('../../utilities/DateHandler');
  return {
    __esModule: true,
    ...originalModule,
    createISODateString: jest.fn(),
  };
});

describe('setCaseStatus', () => {
  const changedBy = 'Test Docket Clerk 1';
  it('should update the case status and set the associated judge to the chief judge when the new status is "General Docket - Not At Issue"', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus({
      changedBy,
      updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
    });

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    expect(updatedCase.associatedJudge).toEqual(CHIEF_JUDGE);
  });

  it('should update the case status and set the associated judge to the chief judge when the new status is "General Docket - Ready for Trial"', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus({
      changedBy,
      updatedCaseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
    });

    expect(updatedCase.status).toEqual(
      CASE_STATUS_TYPES.generalDocketReadyForTrial,
    );
    expect(updatedCase.associatedJudge).toEqual(CHIEF_JUDGE);
  });

  it('should update the case status, leave the associated judge unchanged, and set the case status to closed"', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus({
      changedBy,
      updatedCaseStatus: CASE_STATUS_TYPES.closed,
    });

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closed);
    expect(updatedCase.associatedJudge).toEqual('Judge Buch');
  });

  it('should update the case status, leave the associated judge unchanged, and set the case status to "Closed - Dismissed"', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus({
      changedBy,
      updatedCaseStatus: CASE_STATUS_TYPES.closedDismissed,
    });

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closedDismissed);
    expect(updatedCase.associatedJudge).toEqual('Judge Buch');
  });

  it('should update the case status and call reopenCase when the new status is NOT a closed case status and the previous status is a closed case status', () => {
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
        status: CLOSED_CASE_STATUSES[0],
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus({
      changedBy,
      updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
    });

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.generalDocket);
  });

  it('should add a new entry to the caseStatusHistory after changing the case status', () => {
    const mockCreateIsoDateString = createISODateString as jest.Mock;
    mockCreateIsoDateString.mockReturnValue('2019-08-25T05:00:00.000Z');
    const updatedCase = new Case(
      {
        ...MOCK_CASE,
        associatedJudge: 'Judge Buch',
        status: CLOSED_CASE_STATUSES[0],
      },
      {
        applicationContext,
      },
    );

    updatedCase.setCaseStatus({
      changedBy: 'Test Docket Clerk',
      updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
    });

    expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.generalDocket);
    expect(updatedCase.caseStatusHistory).toEqual([
      {
        changedBy: 'Test Docket Clerk',
        date: '2019-08-25T05:00:00.000Z',
        updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
      },
    ]);
  });
});
