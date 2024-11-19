import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getSuggestedCalendarCases } from './getSuggestedCalendarCases';
jest.mock('./searchClient');
import { search } from './searchClient';

describe('getSuggestedCalendarCases', () => {
  it('should search for docket entries of type `Answer` which were served greater than 45 days ago and whose case status is `General Docket - Not at Issue`', async () => {
    const mockSearch = search as jest.Mock;
    mockSearch.mockResolvedValue({
      results: [
        {
          docketNumber: '22083-22',
          preferredTrialCity: 'San Francisco, California',
          procedureType: 'Regular',
          status: 'General Docket - At Issue (Ready for Trial)',
        },
        {
          docketNumber: '16927-23',
          preferredTrialCity: 'Chicago, Illinois',
          procedureType: 'Small',
          status: 'General Docket - At Issue (Ready for Trial)',
        },
        {
          docketNumber: '9844-24',
          preferredTrialCity: 'Portland, Oregon',
          procedureType: 'Regular',
          status: 'General Docket - At Issue (Ready for Trial)',
        },
      ],
      total: 3,
    });

    await getSuggestedCalendarCases({
      applicationContext,
    });

    expect(mockSearch.mock.calls[0][0].searchParameters.body._source).toEqual([
      'docketNumber',
      'preferredTrialCity',
      'procedureType',
      'status',
    ]);

    expect(
      mockSearch.mock.calls[0][0].searchParameters.body.query,
    ).toMatchObject({
      bool: {
        must: [
          {
            term: {
              'status.S': CASE_STATUS_TYPES.generalDocketReadyForTrial,
            },
          },
          {
            exists: {
              field: 'preferredTrialCity',
            },
          },
        ],
        must_not: [
          {
            term: {
              'blocked.BOOL': true,
            },
          },
          {
            term: {
              'automaticBlocked.BOOL': true,
            },
          },
        ],
      },
    });
  });
});
