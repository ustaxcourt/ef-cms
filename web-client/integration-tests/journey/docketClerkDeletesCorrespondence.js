export const docketClerkDeletesCorrespondence = (test, correspondenceTitle) =>
  it('docketclerk deletes correspondence', async () => {
    await test.runSequence('openConfirmDeleteCorrespondenceModalSequence', {
      correspondenceId: test.correspondenceDocument.correspondenceId,
      documentTitle: correspondenceTitle,
    });

    expect(test.getState('modal.showModal')).toEqual(
      'DeleteCorrespondenceModal',
    );

    await test.runSequence('deleteCorrespondenceDocumentSequence');

    expect(test.getState('caseDetail.correspondence')).toEqual([]);
  });
