import { runCompute } from 'cerebral/test';

import { extractedDocument } from '../../presenter/computeds/extractDocument';
import { extractedWorkItems } from '../../presenter/computeds/extractWorkItems';

export default test => {
  return it('Docket clerk views document detail', async () => {
    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId: test.documentId,
    });
    expect(test.getState('currentPage')).toEqual('DocumentDetail');
    const caseDetail = test.getState('caseDetail');
    expect(caseDetail.docketNumber).toEqual(test.docketNumber);
    let workItem;
    caseDetail.documents.forEach(document =>
      document.workItems.forEach(item => {
        if (item.workItemId === test.workItemId) {
          workItem = item;
        }
      }),
    );
    expect(workItem).toMatchObject({
      assigneeId: null,
      assigneeName: null,
    });
    expect(workItem.messages[0]).toMatchObject({
      message: 'a Stipulated Decision filed by respondent is ready for review',
      userId: 'respondent',
      sentBy: 'Test Respondent',
    });

    const documentResult = runCompute(extractedDocument, {
      state: test.getState(),
    });
    expect(documentResult).toBeDefined();
    const workItemsResult = runCompute(extractedWorkItems, {
      state: test.getState(),
    });
    expect(workItemsResult[0].createdAtFormatted).toBeDefined();
  });
};
