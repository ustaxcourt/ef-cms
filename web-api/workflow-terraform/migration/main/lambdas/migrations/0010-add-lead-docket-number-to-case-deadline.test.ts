import { CASE_STATUS_TYPES } from '../../../../../../shared/src/business/entities/EntityConstants';
import { aggregateCaseItems } from '../../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems';
import { migrateItems } from './0010-add-lead-docket-number-to-case-deadline';
jest.mock(
  '../../../../../../shared/src/persistence/dynamo/helpers/aggregateCaseItems',
);
import { queryFullCase } from '../utilities/queryFullCase';
jest.mock('../utilities/queryFullCase');

let documentClientMock;
const MOCK_CONSOLIDATED_CASE_RECORD = {
  associatedJudge: 'Colvin',
  docketNumber: '101-18',
  docketNumberWithSuffix: '101-18',
  entityName: 'Case',
  leadDocketNumber: '101-18',
  pk: 'case|101-18',
  sk: 'case|101-18',
  status: CASE_STATUS_TYPES.calendared,
  trialDate: '2020-03-01T00:00:00.000Z',
  trialLocation: 'Washington, District of Columbia',
  trialSessionId: '7805d1ab-18d0-43ec-bafb-654e83405410',
};

const MOCK_CASE_RECORD = {
  associatedJudge: 'Colvin',
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

describe('migrateItems', () => {
  it('should return and not modify records that do not have a leadDocketNUmber', async () => {
    (queryFullCase as jest.Mock).mockResolvedValue({
      pk: `case|${MOCK_CASE_RECORD.docketNumber}`,
      sk: `case|${MOCK_CASE_RECORD.docketNumber}`,
    });
    (aggregateCaseItems as jest.Mock).mockReturnValue(MOCK_CASE_RECORD);

    const mockNonConsolidatedCaseDeadlineItem = [
      {
        associatedJudge: MOCK_CASE_RECORD.associatedJudge,
        caseDeadLineId: '97a214a0-437d-461b-80a9-1cfd3d669690',
        createdAt: '2023-06-06T18:55:57.361Z',
        deadlineDate: '2023-06-10T04:00:00.000Z',
        description: 'test',
        docketNumber: MOCK_CASE_RECORD.docketNumber,
        entityName: 'CaseDeadline',
        pk: 'case-deadline|97a214a0-437d-461b-80a9-1cfd3d669690',
        sk: 'case-deadline|97a214a0-437d-461b-80a9-1cfd3d669690',
        sortableDocketNumber: 2018000101,
      },
    ];

    const results = await migrateItems(
      mockNonConsolidatedCaseDeadlineItem,
      documentClientMock,
    );

    expect(results).toEqual(mockNonConsolidatedCaseDeadlineItem);
  });

  it('should modify CaseDeadline when the case has a leadDocketNumber, adding the case\'s property "leadDocketNumber" to the CaseDeadline', async () => {
    (queryFullCase as jest.Mock).mockResolvedValue({
      pk: `case|${MOCK_CONSOLIDATED_CASE_RECORD.docketNumber}`,
      sk: `case|${MOCK_CONSOLIDATED_CASE_RECORD.docketNumber}`,
    });
    (aggregateCaseItems as jest.Mock).mockReturnValue(
      MOCK_CONSOLIDATED_CASE_RECORD,
    );

    const mockConsolidatedCaseDeadlineItemWithoutLeadDocketNumber = [
      {
        associatedJudge: MOCK_CONSOLIDATED_CASE_RECORD.associatedJudge,
        caseDeadLineId: '97a214a0-437d-461b-80a9-1cfd3d669690',
        createdAt: '2023-06-06T18:55:57.361Z',
        deadlineDate: '2023-06-10T04:00:00.000Z',
        description: 'test',
        docketNumber: MOCK_CONSOLIDATED_CASE_RECORD.docketNumber,
        entityName: 'CaseDeadline',
        pk: 'case-deadline|97a214a0-437d-461b-80a9-1cfd3d669690',
        sk: 'case-deadline|97a214a0-437d-461b-80a9-1cfd3d669690',
        sortableDocketNumber: 2018000101,
      },
    ];

    const mockConsolidatedCaseDeadlineItemWithLeadDocketNumber = [
      {
        ...mockConsolidatedCaseDeadlineItemWithoutLeadDocketNumber[0],
        leadDocketNumber: MOCK_CONSOLIDATED_CASE_RECORD.leadDocketNumber,
      },
    ];

    const results = await migrateItems(
      mockConsolidatedCaseDeadlineItemWithoutLeadDocketNumber,
      documentClientMock,
    );

    expect(results).toEqual(
      mockConsolidatedCaseDeadlineItemWithLeadDocketNumber,
    );
  });
});
