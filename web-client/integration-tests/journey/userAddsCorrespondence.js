import { fakeFile } from '../helpers';

export const userAddsCorrespondence = (
  cerebralTest,
  correspondenceTitle,
  user,
) =>
  it(`${user} adds correspondence to case`, async () => {
    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: correspondenceTitle,
    });

    await cerebralTest.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await cerebralTest.runSequence('uploadCorrespondenceDocumentSequence', {
      tab: 'correspondence',
    });

    expect(cerebralTest.getState('validationErrors')).toEqual({});
    expect(cerebralTest.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: correspondenceTitle,
        }),
      ]),
    );
    expect(cerebralTest.getState('currentPage')).toEqual('CaseDetailInternal');
    const displayedCorrespondenceId = cerebralTest.getState('correspondenceId');
    const mostRecentCorrespondence = cerebralTest
      .getState('caseDetail.correspondence')
      .slice(-1)
      .pop();
    expect(displayedCorrespondenceId).toEqual(
      mostRecentCorrespondence.correspondenceId,
    );
  });
