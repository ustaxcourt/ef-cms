export const docketClerkNavigatesToEditCorrespondence = (
  test,
  correspondenceTitle,
) =>
  it('docketclerk navigates to edit correspondence', async () => {
    test.correspondenceDocument = test
      .getState('caseDetail.correspondence')
      .find(
        _correspondence =>
          _correspondence.documentTitle === correspondenceTitle,
      );

    await test.runSequence('gotoEditCorrespondenceDocumentSequence', {
      docketNumber: test.docketNumber,
      documentId: test.correspondenceDocument.documentId,
    });

    expect(test.getState('currentPage')).toEqual('EditCorrespondenceDocument');
  });
