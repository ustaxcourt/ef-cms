import {
  CASE_STATUS_TYPES,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { getCaseByDocketNumber } from './getCaseByDocketNumber';

describe('getCaseByDocketNumber', () => {
  it('should return data as received from persistence', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              docketNumber: '123-20',
              pk: 'case|123-20',
              sk: 'case|123-20',
              status: CASE_STATUS_TYPES.new,
            },
          ],
        }),
    });

    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '123-20',
    });

    expect(result).toEqual({
      archivedCorrespondences: [],
      archivedDocketEntries: [],
      consolidatedCases: [],
      correspondence: [],
      docketEntries: [],
      docketNumber: '123-20',
      hearings: [],
      irsPractitioners: [],
      privatePractitioners: [],
      status: CASE_STATUS_TYPES.new,
    });
  });

  it('should return case and its associated data', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              docketNumber: '123-20',
              judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
              pk: 'case|123-20',
              sk: 'case|23',
              status: CASE_STATUS_TYPES.new,
            },
            {
              pk: 'case|123-20',
              sk: 'hearing|123',
              trialSessionId: '123',
            },
            {
              pk: 'case|123-20',
              sk: 'irsPractitioner|123',
              userId: 'abc-123',
            },
            {
              pk: 'case|123-20',
              sk: 'privatePractitioner|123',
              userId: 'abc-123',
            },
            {
              archived: true,
              docketEntryId: 'abc-123',
              pk: 'case|123-20',
              sk: 'docket-entry|123',
            },
            {
              archived: false,
              docketEntryId: 'abc-124',
              pk: 'case|123-20',
              sk: 'docket-entry|124',
            },
            {
              archived: true,
              correspondenceId: 'abc-123',
              pk: 'case|123-20',
              sk: 'correspondence|123',
            },
            {
              archived: false,
              correspondenceId: 'abc-124',
              pk: 'case|123-20',
              sk: 'correspondence|124',
            },
            {
              name: 'Judge Fieri',
              pk: 'case|123-20',
              role: ROLES.legacyJudge,
              sk: 'user|ce92c582-186f-45a7-a5f5-e1cec03521ad',
              userId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
            },
          ],
        }),
    });

    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '123-20',
    });

    expect(result).toEqual({
      archivedCorrespondences: [
        {
          archived: true,
          correspondenceId: 'abc-123',
        },
      ],
      archivedDocketEntries: [
        {
          archived: true,
          docketEntryId: 'abc-123',
        },
      ],
      associatedJudge: 'Judge Fieri',
      consolidatedCases: [],
      correspondence: [
        {
          archived: false,
          correspondenceId: 'abc-124',
        },
      ],
      docketEntries: [
        {
          archived: false,
          docketEntryId: 'abc-124',
        },
      ],
      docketNumber: '123-20',
      hearings: [
        {
          trialSessionId: '123',
        },
      ],
      irsPractitioners: [{ userId: 'abc-123' }],
      judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
      privatePractitioners: [
        {
          userId: 'abc-123',
        },
      ],
      status: CASE_STATUS_TYPES.new,
    });
  });

  it('should return default object if nothing is returned from the client query request', async () => {
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () => Promise.resolve({ Items: [] }),
    });

    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: '123-20',
    });

    expect(result).toEqual({
      archivedCorrespondences: [],
      archivedDocketEntries: [],
      consolidatedCases: [],
      correspondence: [],
      docketEntries: [],
      hearings: [],
      irsPractitioners: [],
      privatePractitioners: [],
    });
  });

  it('should return an array of correctly composed consolidated cases attached to the case', async () => {
    const leadDocketNumber = '123-20';
    const docketNumber1 = '124-20';
    const firstQueryResult = [
      {
        name: 'Judge Fieri',
        pk: `case|${leadDocketNumber}`,
        role: ROLES.legacyJudge,
        sk: 'user|ce92c582-186f-45a7-a5f5-e1cec03521ad',
        userId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
      },
      {
        docketNumber: leadDocketNumber,
        gsi1pk: `leadCase|${leadDocketNumber}`,
        judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
        leadDocketNumber,
        pk: `case|${leadDocketNumber}`,
        sk: `case|${leadDocketNumber}`,
        status: CASE_STATUS_TYPES.new,
      },
      {
        pk: `case|${leadDocketNumber}`,
        sk: 'hearing|123',
        trialSessionId: '123',
      },
      {
        gsi1pk: `leadCase|${leadDocketNumber}`,
        pk: `case|${leadDocketNumber}`,
        sk: 'irsPractitioner|123',
        userId: 'abc-123',
      },
      {
        gsi1pk: `leadCase|${leadDocketNumber}`,
        pk: `case|${leadDocketNumber}`,
        sk: 'privatePractitioner|123',
        userId: 'abc-123',
      },
      {
        archived: false,
        docketEntryId: 'abc-123',
        pk: `case|${leadDocketNumber}`,
        sk: 'docket-entry|123',
      },
    ];
    const secondQueryResult = [
      {
        docketNumber: leadDocketNumber,
        gsi1pk: `leadCase|${leadDocketNumber}`,
        judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
        leadDocketNumber,
        pk: `case|${leadDocketNumber}`,
        sk: `case|${leadDocketNumber}`,
        status: CASE_STATUS_TYPES.new,
      },
      {
        gsi1pk: `leadCase|${leadDocketNumber}`,
        pk: `case|${leadDocketNumber}`,
        sk: 'irsPractitioner|123',
        userId: 'abc-123',
      },
      {
        gsi1pk: `leadCase|${leadDocketNumber}`,
        pk: `case|${leadDocketNumber}`,
        sk: 'privatePractitioner|123',
        userId: 'abc-123',
      },
      {
        docketNumber: docketNumber1,
        gsi1pk: `leadCase|${leadDocketNumber}`,
        judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
        leadDocketNumber,
        pk: `case|${docketNumber1}`,
        sk: `case|${docketNumber1}`,
        status: CASE_STATUS_TYPES.new,
      },
      {
        gsi1pk: `leadCase|${leadDocketNumber}`,
        pk: `case|${docketNumber1}`,
        sk: 'irsPractitioner|124',
        userId: 'abc-124',
      },
      {
        gsi1pk: `leadCase|${leadDocketNumber}`,
        pk: `case|${docketNumber1}`,
        sk: 'privatePractitioner|124',
        userId: 'abc-124',
      },
    ];
    applicationContext
      .getDocumentClient()
      .query.mockReturnValueOnce({
        promise: () => Promise.resolve({ Items: firstQueryResult }),
      })
      .mockReturnValueOnce({
        promise: () => Promise.resolve({ Items: secondQueryResult }),
      });

    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: leadDocketNumber,
    });

    expect(result).toEqual({
      archivedCorrespondences: [],
      archivedDocketEntries: [],
      associatedJudge: 'Judge Fieri',
      consolidatedCases: [
        {
          docketNumber: leadDocketNumber,
          entityName: 'ConsolidatedCaseSummary',
          irsPractitioners: [
            {
              userId: 'abc-123',
            },
          ],
          leadDocketNumber,
          petitioners: [],
          privatePractitioners: [
            {
              userId: 'abc-123',
            },
          ],
          status: CASE_STATUS_TYPES.new,
        },
        {
          docketNumber: docketNumber1,
          entityName: 'ConsolidatedCaseSummary',
          irsPractitioners: [
            {
              userId: 'abc-124',
            },
          ],
          leadDocketNumber,
          petitioners: [],
          privatePractitioners: [
            {
              userId: 'abc-124',
            },
          ],
          status: CASE_STATUS_TYPES.new,
        },
      ],
      correspondence: [],
      docketEntries: [
        {
          archived: false,
          docketEntryId: 'abc-123',
        },
      ],
      docketNumber: '123-20',
      hearings: [
        {
          trialSessionId: '123',
        },
      ],
      irsPractitioners: [
        {
          userId: 'abc-123',
        },
      ],
      judgeUserId: 'ce92c582-186f-45a7-a5f5-e1cec03521ad',
      leadDocketNumber,
      privatePractitioners: [
        {
          userId: 'abc-123',
        },
      ],
      status: CASE_STATUS_TYPES.new,
    });
  });

  it('does not make call to fetch consolidated cases if includeConsolidatedCases is false', async () => {
    const leadDocketNumber = '123-20';
    applicationContext.getDocumentClient().query.mockReturnValue({
      promise: () =>
        Promise.resolve({
          Items: [
            {
              docketNumber: '123-20',
              leadDocketNumber,
              pk: 'case|123-20',
              sk: 'case|123-20',
              status: CASE_STATUS_TYPES.new,
            },
          ],
        }),
    });

    const result = await getCaseByDocketNumber({
      applicationContext,
      docketNumber: leadDocketNumber,
      includeConsolidatedCases: false,
    });

    expect(applicationContext.getDocumentClient().query).toHaveBeenCalledTimes(
      1,
    );

    expect(result.consolidatedCases).toEqual([]);
  });
});
