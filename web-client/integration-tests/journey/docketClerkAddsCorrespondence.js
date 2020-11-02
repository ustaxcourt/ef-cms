import { fakeFile } from '../helpers';

export const docketClerkAddsCorrespondence = (test, correspondenceTitle) =>
  it('docketclerk adds correspondence to case', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: correspondenceTitle,
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('uploadCorrespondenceDocumentSequence', {
      tab: 'correspondence',
    });

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: correspondenceTitle,
        }),
      ]),
    );
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
    const displayedCorrespondenceId = test.getState('correspondenceId');
    const mostRecentCorrespondence = test
      .getState('caseDetail.correspondence')
      .slice(-1)
      .pop();
    expect(displayedCorrespondenceId).toEqual(
      mostRecentCorrespondence.correspondenceId,
    );
  });
