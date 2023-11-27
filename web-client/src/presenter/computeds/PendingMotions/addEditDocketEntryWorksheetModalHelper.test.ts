import { MOCK_CASE } from '@shared/test/mockCase';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

import { addEditDocketEntryWorksheetModalHelper as addEditDocketEntryWorksheetModalHelperComputed } from './addEditDocketEntryWorksheetModalHelper';

describe('addEditDocketEntryWorksheetModalHelper', () => {
  const addEditDocketEntryWorksheetModalHelper = withAppContextDecorator(
    addEditDocketEntryWorksheetModalHelperComputed,
  );
  it('should return the title of the modal formatted to include the docket number and case title of the case', () => {
    const { title } = runCompute(addEditDocketEntryWorksheetModalHelper, {
      state: {
        form: {
          docketEntryId: MOCK_CASE.docketEntries[0].docketEntryId,
          docketNumber: MOCK_CASE.docketNumber,
        },
        pendingMotions: {
          docketEntries: [
            {
              caseCaption: MOCK_CASE.caseCaption,
              consolidatedGroupCount: 1,
              createdAt: '2000-04-29T15:52:05.725Z',
              daysSinceCreated: 8607,
              docketEntryId: MOCK_CASE.docketEntries[0].docketEntryId,
              docketEntryWorksheet: {
                docketEntryId: MOCK_CASE.docketEntries[0].docketEntryId,
                entityName: 'DocketEntryWorksheet',
                finalBriefDueDate: 'SOME FINAL BRIEF DUE DATE',
                primaryIssue: 'SOME PRIMARY ISSUE',
                statusOfMatter: 'SOME STATUS OF MATTER',
              },
              eventCode: 'M218',
              leadDocketNumber: undefined,
              pending: true,
            },
          ],
        },
      },
    });
    expect(title).toBe(
      `Docket ${MOCK_CASE.docketNumber}: ${applicationContext.getCaseTitle(
        MOCK_CASE.caseCaption,
      )}`,
    );
  });
});
