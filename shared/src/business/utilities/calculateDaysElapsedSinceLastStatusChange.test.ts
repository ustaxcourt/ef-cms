import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { MOCK_CASE, MOCK_SUBMITTED_CASE } from '@shared/test/mockCase';
import { applicationContextForClient } from '@web-client/test/createClientTestApplicationContext';
import { calculateDaysElapsedSinceLastStatusChange } from './calculateDaysElapsedSinceLastStatusChange';

describe('calculateDaysElapsedSinceLastStatusChange', () => {
  let mockCaseInfo: RawCase;

  beforeEach(() => {
    mockCaseInfo = {
      ...MOCK_CASE,
      caseCaption: 'CASE CAPTION',
      caseStatusHistory: [
        {
          changedBy: 'Private Practitioner',
          date: '2018-07-27T00:00:00.000-04:00',
          updatedCaseStatus: CASE_STATUS_TYPES.cav,
        },
        {
          changedBy: 'Private Practitioner',
          date: '2018-07-07T00:00:00.000-04:00',
          updatedCaseStatus: CASE_STATUS_TYPES.new,
        },
        {
          changedBy: 'Private Practitioner',
          date: '2018-07-03T00:00:00.000-04:00',
          updatedCaseStatus: CASE_STATUS_TYPES.generalDocket,
        },
      ],
      docketNumber: MOCK_SUBMITTED_CASE.docketNumber,
      docketNumberWithSuffix: `${MOCK_SUBMITTED_CASE.docketNumber}R`,
      petitioners: [],
      status: CASE_STATUS_TYPES.cav,
    };
  });

  it('should return the number of days since the case status last changed and the day on which it was changed', () => {
    const mockToday = '2019-07-27T00:00:00.000-04:00';
    applicationContextForClient
      .getUtilities()
      .prepareDateFromString.mockReturnValue(mockToday);

    const result = calculateDaysElapsedSinceLastStatusChange(
      applicationContextForClient,
      mockCaseInfo,
    );

    expect(result).toEqual({
      daysElapsedSinceLastStatusChange: 365,
      statusDate: '07/27/18',
    });
  });

  it('should return 0 days since the case status last changed and empty status date when there is no caseStatusHistory', () => {
    mockCaseInfo.caseStatusHistory = [];

    const result = calculateDaysElapsedSinceLastStatusChange(
      applicationContextForClient,
      mockCaseInfo,
    );

    expect(result).toEqual({
      daysElapsedSinceLastStatusChange: 0,
      statusDate: '',
    });
  });
});
