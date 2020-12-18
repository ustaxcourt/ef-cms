export const docketClerkDeletesCorrespondence = (test, correspondenceTitle) =>
  it('Docket clerk deletes correspondence', async () => {
    await test.runSequence('openConfirmDeleteCorrespondenceModalSequence', {
      correspondenceId: test.correspondenceDocument.correspondenceId,
      documentTitle: correspondenceTitle,
    });

    expect(test.getState('modal.showModal')).toEqual(
      'DeleteCorrespondenceModal',
    );

    await test.runSequence('deleteCorrespondenceDocumentSequence');

    const deletedCorrespondence = test
      .getState('caseDetail.correspondence')
      .find(
        c =>
          c.correspondenceId === test.correspondenceDocument.correspondenceId,
      );
    expect(deletedCorrespondence).toBeUndefined();

    expect(test.getState('caseDetail.messages')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachments: expect.arrayContaining([
            expect.objectContaining({
              documentId: test.correspondenceDocument.correspondenceId,
            }),
          ]),
        }),
      ]),
    );
  });
