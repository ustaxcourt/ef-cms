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
      correspondenceId: test.correspondenceDocument.correspondenceId,
      docketNumber: test.docketNumber,
    });

    expect(test.getState('currentPage')).toEqual('EditCorrespondenceDocument');
  });
