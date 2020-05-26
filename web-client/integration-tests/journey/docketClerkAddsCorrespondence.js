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

    await test.runSequence('uploadCorrespondenceDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('caseDetail.correspondence')).not.toBe([]);
    expect(test.getState('caseDetail.correspondence')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          documentTitle: 'My correspondence',
        }),
      ]),
    );
    expect(test.getState('currentPage')).toEqual('CaseDetailInternal');
  });
