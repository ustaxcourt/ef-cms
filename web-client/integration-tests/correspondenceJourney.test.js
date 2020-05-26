import { fakeFile, loginAs, setupTest, uploadPetition } from './helpers';

const test = setupTest();
let caseDetail;

const secondAddCorr = test => {
  it('can add a correspondence document to a case', async () => {
    await test.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: 'My correspondence',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'documentTitle',
      value: 'My correspondence',
    });

    await test.runSequence('updateFormValueSequence', {
      key: 'primaryDocumentFile',
      value: fakeFile,
    });

    await test.runSequence('uploadCorrespondenceDocumentSequence');

    console.log('-----', test.getState('caseDetail'));

    expect(test.getState('validationErrors')).toEqual({});
    expect(test.getState('caseDetail.correspondence')).not.toBe([]);
  });
};
describe('Create a work item', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner');
  it('create case', async () => {
    caseDetail = await uploadPetition(test);
    expect(caseDetail).toBeDefined();
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'docketclerk');
  it('cannot add a correspondence without a title or [rimary document file', async () => {
    await test.runSequence('uploadCorrespondenceDocumentSequence');

    expect(test.getState('validationErrors')).toEqual({
      documentTitle: 'Enter a description',
      primaryDocumentFile: 'Upload a document',
    });
  });

  // secondAddCorr(test);
});
