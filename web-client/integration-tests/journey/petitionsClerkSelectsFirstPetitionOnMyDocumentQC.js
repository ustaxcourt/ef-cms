export const petitionsClerkSelectsFirstPetitionOnMyDocumentQC = test => {
  return it('Petitions clerk selects first petition on My Document QC', async () => {
    const workItem = test
      .getState('workQueue')
      .find(workItem => workItem.docketNumber === test.docketNumber);

    const { documentId } = workItem.document;
    const { messageId } = workItem.messages[0];

    test.documentId = documentId;
    test.messageId = messageId;

    await test.runSequence('gotoDocumentDetailSequence', {
      docketNumber: test.docketNumber,
      documentId,
      messageId,
    });

    expect(test.getState('currentPage')).toEqual('DocumentDetail');
  });
};
