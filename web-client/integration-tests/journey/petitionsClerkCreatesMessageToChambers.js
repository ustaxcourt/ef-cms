import { getPetitionDocumentForCase } from '../helpers';

export default (test, message, createdCases) => {
  return it('Petitions clerk sends message to judgeArmen', async () => {
    const petitionDocument = getPetitionDocumentForCase(createdCases[0]);
    const workItem = petitionDocument.workItems[0];

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: createdCases[0].docketNumber,
      documentId: petitionDocument.documentId,
    });

    // armensChambers
    const assigneeId = '9c9292a4-2d5d-45b1-b67f-ac0e1c9b5df5';

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
