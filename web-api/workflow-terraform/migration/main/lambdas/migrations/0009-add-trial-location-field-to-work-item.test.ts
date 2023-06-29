import { CASE_STATUS_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { aggregateCaseItems } from '../../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems';
jest.mock(
  '../../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems',
);
import { migrateItems } from './0009-add-trial-location-field-to-work-item';
import { queryFullCase } from '../utilities/queryFullCase';
jest.mock('../utilities/queryFullCase');

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

    (queryFullCase as jest.Mock).mockResolvedValue({
      pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
      sk: `case|${MOCK_CASE_RECORD.docketNumber}`,
      trialLocation: `${MOCK_CASE_RECORD.trialLocation}`,
    });
    (aggregateCaseItems as jest.Mock).mockReturnValue(MOCK_CASE_RECORD);
  });

  it('should return and not modify records that are not WorkItems or OutboxItems', async () => {
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

  it('should return and not modify OutboxItems that do not have a caseStatus of Calendared', async () => {
    const mockItems = [
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        caseStatus: CASE_STATUS_TYPES.generalDocket,
        pk: 'user-outbox|8b4cd447-6278-461b-b62b-d9e357eea62c',
        sk: '2018-11-21T20:49:28.192Z',
      },
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'case|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
      {
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        pk: 'section-outbox|8b4cd447-6278-461b-b62b-d9e357eea62c',
        sk: '2018-11-21T20:49:28.192Z',
      },
    ];
    const results = await migrateItems(mockItems, documentClientMock);

    expect(results).toEqual(mockItems);
  });

  it('should modify WorkItems that have a caseStatus of Calendared, adding the case\'s property "trialLocation" to the Work Item', async () => {
    const mockItems = [
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        caseStatus: CASE_STATUS_TYPES.calendared,
        docketNumber: MOCK_CASE_RECORD.docketNumber,
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        section: 'Docket',
        sentBy: 'You',
        sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
        trialDate: undefined,
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
      docketNumber: MOCK_CASE_RECORD.docketNumber,
      pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
      section: 'Docket',
      sentBy: 'You',
      sk: 'work-item|6d74eadc-0181-4ff5-826c-123432e8733d',
      trialDate: MOCK_CASE_RECORD.trialDate,
      trialLocation: MOCK_CASE_RECORD.trialLocation,
    });
  });

  it('should modify OutboxItems that have a caseStatus of Calendared, adding the case\'s property "trialLocation" to the OutboxItem', async () => {
    const mockItems = [
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        caseStatus: CASE_STATUS_TYPES.calendared,
        docketNumber: MOCK_CASE_RECORD.docketNumber,
        pk: 'user-outbox|8b4cd447-6278-461b-b62b-d9e357eea62c',
        section: 'Docket',
        sentBy: 'You',
        sk: '2018-11-21T20:49:28.192Z',
      },
      {
        pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
        sk: 'case|83b77e98-4cf6-4fb4-b8c0-f5f90fd68f3c',
      },
      {
        caseStatus: CASE_STATUS_TYPES.generalDocketReadyForTrial,
        pk: 'section-outbox|8b4cd447-6278-461b-b62b-d9e357eea62c',
        sk: '2018-11-21T20:49:28.192Z',
      },
    ];

    const results = await migrateItems(mockItems, documentClientMock);

    expect(results[1]).toEqual({
      caseStatus: CASE_STATUS_TYPES.calendared,
      docketNumber: MOCK_CASE_RECORD.docketNumber,
      pk: 'user-outbox|8b4cd447-6278-461b-b62b-d9e357eea62c',
      section: 'Docket',
      sentBy: 'You',
      sk: '2018-11-21T20:49:28.192Z',
      trialDate: MOCK_CASE_RECORD.trialDate,
      trialLocation: MOCK_CASE_RECORD.trialLocation,
    });
  });
});
