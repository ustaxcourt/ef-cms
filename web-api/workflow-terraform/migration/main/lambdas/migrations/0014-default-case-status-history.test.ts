import {
  MOCK_CASE,
  MOCK_SUBMITTED_CASE,
} from '../../../../../../shared/src/test/mockCase';
import { migrateItems } from './0014-default-case-status-history';

describe('migrateItems', () => {
  it('should add an empty case status history for cases that do not have one already', () => {
    const items = [
      {
        caseStatusHistory: undefined,
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
      },
      {
        caseStatusHistory: MOCK_SUBMITTED_CASE.caseStatusHistory,
        pk: `case|${MOCK_SUBMITTED_CASE.docketNumber}`,
        sk: `case|${MOCK_SUBMITTED_CASE.docketNumber}`,
      },
    ];

    const results = migrateItems(items);

    expect(results).toEqual([
      {
        caseStatusHistory: [],
        pk: `case|${MOCK_CASE.docketNumber}`,
        sk: `case|${MOCK_CASE.docketNumber}`,
      },
      {
        caseStatusHistory: MOCK_SUBMITTED_CASE.caseStatusHistory,
        pk: `case|${MOCK_SUBMITTED_CASE.docketNumber}`,
        sk: `case|${MOCK_SUBMITTED_CASE.docketNumber}`,
      },
    ]);
  });
});
