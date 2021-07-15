export const docketClerkDeletesCorrespondence = (
  cerebralTest,
  correspondenceTitle,
) =>
  it('Docket clerk deletes correspondence', async () => {
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

    expect(cerebralTest.getState('caseDetail.messages')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachments: expect.arrayContaining([
            expect.objectContaining({
              documentId: cerebralTest.correspondenceDocument.correspondenceId,
            }),
          ]),
        }),
      ]),
    );
  });
