import { getPetitionDocumentForCase } from '../helpers';

export default (test, message, createdCases) => {
  return it('Petitions clerk sends message to judgeArmen', async () => {
    const petitionDocument = getPetitionDocumentForCase(createdCases[0]);
    const workItem = petitionDocument.workItems[0];

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: createdCases[0].docketNumber,
      documentId: petitionDocument.documentId,
    });

    // judgeArmen
    const assigneeId = 'dabbad00-18d0-43ec-bafb-654e83405416';

    test.setState('form', {
      [workItem.workItemId]: {
        assigneeId: assigneeId,
        forwardMessage: message,
        section: 'armensChambers',
      },
    });

    await test.runSequence('submitForwardSequence', {
      workItemId: workItem.workItemId,
    });

    const caseDetail = test.getState('caseDetail');
    let updatedWorkItem;
    caseDetail.documents.forEach(document =>
      document.workItems.forEach(item => {
        if (item.workItemId === workItem.workItemId) {
          updatedWorkItem = item;
        }
      }),
    );

    expect(updatedWorkItem.assigneeId).toEqual(assigneeId);
  });
};
