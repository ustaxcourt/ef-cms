export const userDeletesCorrespondence = (
  cerebralTest,
  correspondenceTitle,
  user,
) =>
  it(`${user} deletes correspondence`, async () => {
    await cerebralTest.runSequence(
      'openConfirmDeleteCorrespondenceModalSequence',
      {
        correspondenceId: cerebralTest.correspondenceDocument.correspondenceId,
        documentTitle: correspondenceTitle,
      },
    );

    expect(cerebralTest.getState('modal.showModal')).toEqual(
      'DeleteCorrespondenceModal',
    );

    await cerebralTest.runSequence('deleteCorrespondenceDocumentSequence');

    const deletedCorrespondence = cerebralTest
      .getState('caseDetail.correspondence')
      .find(
        c =>
          c.correspondenceId ===
          cerebralTest.correspondenceDocument.correspondenceId,
      );
    expect(deletedCorrespondence).toBeUndefined();
  });
