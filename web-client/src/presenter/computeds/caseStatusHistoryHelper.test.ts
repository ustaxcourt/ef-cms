import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { caseStatusHistoryHelper as ccaseStatusHistoryHelperComputed } from './caseStatusHistoryHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const caseStatusHistoryHelper = withAppContextDecorator(
  ccaseStatusHistoryHelperComputed,
);

const { CASE_STATUS_TYPES } = applicationContext.getConstants();

describe('caseTypeDescriptionHelper', () => {
  it('should return a array of formatted case status history objects with a formattedDateChanged', () => {
    const result = runCompute(caseStatusHistoryHelper, {
      state: {
        caseDetail: {
          caseStatusHistory: [
            {
              changedBy: 'Test Docketclerk',
              date: '2025-04-10T04:00:00.000Z',
              updatedCaseStatus: CASE_STATUS_TYPES.new,
            },
          ],
        },
      },
    });

    expect(result.formattedCaseStatusHistory).toMatchObject([
      {
        changedBy: 'Test Docketclerk',
        date: '2025-04-10T04:00:00.000Z',
        formattedDateChanged: '04/10/25',
        updatedCaseStatus: CASE_STATUS_TYPES.new,
      },
    ]);
  });

  it('should return isTableDisplayed = true when the caseStatusHistory array contains any entries', () => {
    const result = runCompute(caseStatusHistoryHelper, {
      state: {
        caseDetail: {
          caseStatusHistory: [
            {
              changedBy: 'Test Docketclerk',
              date: '2025-04-10T04:00:00.000Z',
              updatedCaseStatus: CASE_STATUS_TYPES.new,
            },
          ],
        },
      },
    });

    expect(result.isTableDisplayed).toEqual(true);
  });
  it('should return isTableDisplayed = false when the caseStatusHistory array contains no entries', () => {
    const result = runCompute(caseStatusHistoryHelper, {
      state: {
        caseDetail: {
          caseStatusHistory: [],
        },
      },
    });

    expect(result.isTableDisplayed).toEqual(false);
  });
});
