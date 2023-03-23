import { CASE_STATUS_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { migrateItems } from './0008-add-trial-location-field-to-work-item';
// const MOCK_CASE = require('../../../../../../shared/src/test/mockCase');
// import { MOCK_CASE } from '../../../../../../shared/src/test/mockCase';

let MOCK_CASE_RECORD;
let documentClientMock;

describe('migrateItems', () => {
  beforeEach(() => {
    MOCK_CASE_RECORD = {
      docketNumber: '101-18',
      docketNumberWithSuffix: '101-18',
      entityName: 'Case',
      pk: 'case|101-18',
      sk: 'case|101-18',
      status: CASE_STATUS_TYPES.calendared,
      trialDate: '2020-03-01T00:00:00.000Z',
      trialLocation: 'Washington, District of Columbia',
      trialSessionId: '7805d1ab-18d0-43ec-bafb-654e83405410',
    };

    documentClientMock = {
      query: jest.fn().mockReturnValue({
        promise: () => ({
          Items: [MOCK_CASE_RECORD],
          LastEvaluatedKey: '1',
        }),
      }),
    };
  });

  it('should return and not modify records that are not Work Items', async () => {
    const mockItems = [
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'case|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
    ];
    const results = await migrateItems(mockItems, documentClientMock);

    expect(results).toEqual(mockItems);
  });

  it('should return and not modify WorkItems that do not have a caseStatus of Calendared', async () => {
    const mockItems = [
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        caseStatus: CASE_STATUS_TYPES.generalDocket,
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
      },
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'case|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
      {
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
      },
    ];
    const results = await migrateItems(mockItems, documentClientMock);

    expect(results).toEqual(mockItems);
  });

  it('should modify Work Items that have a caseStatus of Calendared, adding the case\'s property "trialLocation" to the Work Item', async () => {
    jest.mock('../utilities/queryFullCase', () => {
      return {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        trialLocation: `${MOCK_CASE_RECORD.trialLocation}`,
      };
    });

    jest.mock(
      '../../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems',
      () => {
        return {
          pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
          sk: `case|${MOCK_CASE_RECORD.docketNumber}`,
          trialLocation: `${MOCK_CASE_RECORD.trialLocation}`,
        };
      },
    );

    const mockItems = [
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        caseStatus: CASE_STATUS_TYPES.calendared,
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
      },
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'case|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
      {
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
      },
    ];

    const results = await migrateItems(mockItems, documentClientMock);

    expect(results[1]).toEqual({
      caseStatus: CASE_STATUS_TYPES.calendared,
      pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
      sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
      trialLocation: `${MOCK_CASE_RECORD.trialLocation}`,
    });
  });
});
