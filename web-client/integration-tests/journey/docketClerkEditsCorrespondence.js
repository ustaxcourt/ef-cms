export const docketClerkEditsCorrespondence = test =>
  it('docketclerk edits the documentTitle for a correspondence', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: 'My edited correspondence',
    });

    await test.runSequence('editCorrespondenceDocumentSequence');

    expect(test.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentId: test.correspondenceDocument.documentId,
          documentTitle: 'My edited correspondence',
        }),
      ]),
    );
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
  });
