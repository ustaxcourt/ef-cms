import { MOCK_CASE } from '@shared/test/mockCase';
import { pendingMotionsHelper as pendingMotionsHelperComputed } from '@web-client/presenter/computeds/PendingMotions/pendingMotionsHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('pendingMotionsHelper', () => {
  it('should return pending motions formatted with appropriate data', () => {
    const pendingMotionsHelper = withAppContextDecorator(
      pendingMotionsHelperComputed,
    );

    const { formattedPendingMotions } = runCompute(pendingMotionsHelper, {
      state: {
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
                finalBriefDueDate: '2000-04-29T15:52:05.725Z',
                primaryIssue: 'SOME PRIMARY ISSUE',
                statusOfMatter: 'SOME STATUS OF MATTER',
              },
              docketNumber: MOCK_CASE.docketNumber,
              eventCode: 'M218',
              leadDocketNumber: undefined,
              pending: true,
            },
          ],
        },
      },
    });

    expect(formattedPendingMotions[0].finalBriefDueDateFormatted).toEqual(
      '04/29/00',
    );
    expect(formattedPendingMotions[0].documentLink).toEqual(
      `/case-detail/${MOCK_CASE.docketNumber}/document-view?docketEntryId=${MOCK_CASE.docketEntries[0].docketEntryId}`,
    );
    expect(formattedPendingMotions[0].consolidatedIconTooltipText).toEqual('');
    expect(formattedPendingMotions[0].inConsolidatedGroup).toBeFalsy();
    expect(formattedPendingMotions[0].isLeadCase).toBeFalsy();
  });
});
