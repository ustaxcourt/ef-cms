export const userNavigatesToEditCorrespondence = (
  cerebralTest,
  correspondenceTitle,
  user,
) =>
  it(`${user} navigates to edit correspondence`, async () => {
    cerebralTest.correspondenceDocument = cerebralTest
      .getState('caseDetail.correspondence')
      .find(
        _correspondence =>
          _correspondence.documentTitle === correspondenceTitle,
      );

    await cerebralTest.runSequence('gotoEditCorrespondenceDocumentSequence', {
      correspondenceId: cerebralTest.correspondenceDocument.correspondenceId,
      docketNumber: cerebralTest.docketNumber,
    });

    expect(cerebralTest.getState('currentPage')).toEqual(
      'EditCorrespondenceDocument',
    );
  });
