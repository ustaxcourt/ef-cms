import {
  CASE_STATUS_TYPES,
  CLOSED_CASE_STATUSES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { migrateItems } from './0004-remove-closedDate-for-open-cases';
const { MOCK_CASE } = require('../../../../../shared/src/test/mockCase');

describe('migrateItems', () => {
  let mockCaseItem;
  let mockUserCaseItem;

  beforeEach(() => {
    mockCaseItem = {
      ...MOCK_CASE,
      pk: `case|${MOCK_CASE.docketNumber}`,
      sk: `case|${MOCK_CASE.docketNumber}`,
    };

    mockUserCaseItem = {
      caseCaption: 'Brett Osborne, Petitioner',
      docketNumber: MOCK_CASE.docketNumber,
      entityName: 'UserCase',
      gsi1pk: `user-case|${MOCK_CASE.docketNumber}`,
      pk: 'user|7805d1ab-18d0-43ec-bafb-654e83405416',
      sk: `case|${MOCK_CASE.docketNumber}`,
    };
  });

  it('should return and not modify records that are NOT case records', () => {
    const mockTrialSessionId = '87b86617-f090-4f26-a321-3ee0683cc0f2';
    const mockItems = [
      {
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: 'user|6d74eadc-0181-4ff5-826c-305200e8733d',
      },
      {
        pk: `trial-session|${mockTrialSessionId}`,
        sk: `trial-session|${mockTrialSessionId}`,
      },
    ];
    const results = migrateItems(mockItems);

    expect(results).toEqual(mockItems);
  });

  it('should delete closedDate when the record is a case entity with a closedDate and a non-CLOSED_CASE_STATUSES status', () => {
    const items = [{ ...mockCaseItem, closedDate: '2022-12-28 10:14:04' }];

    const results = migrateItems(items);

    expect(results[0].closedDate).toBeUndefined();
  });

  it('should NOT delete closedDate when the record is a case entity with a closedDate and a CLOSED_CASE_STATUSES status', () => {
    const items = [
      {
        ...mockCaseItem,
        closedDate: '2022-12-28 10:14:04',
        status: CLOSED_CASE_STATUSES[0],
      },
    ];

    const results = migrateItems(items);

    expect(results[0].closedDate).toBeDefined();
  });

  it('should delete closedDate when the record is a user case entity with a closedDate and a non-CLOSED_CASE_STATUSES status', () => {
    const items = [
      {
        ...mockUserCaseItem,
        closedDate: '2022-12-28 10:14:04',
        status: CASE_STATUS_TYPES.new,
      },
    ];

    const results = migrateItems(items);

    expect(results[0].closedDate).toBeUndefined();
  });

  it('should not modify the record when it is a user case entity without a closedDate and a non-CLOSED_CASE_STATUSES status', () => {
    const items = [
      {
        ...mockUserCaseItem,
        closedDate: undefined,
        status: CASE_STATUS_TYPES.new,
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual(items);
  });
});
