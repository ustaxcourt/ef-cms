import { associatedExternalUserViewsCaseDetailForOwnedCase } from './journey/associatedExternalUserViewsCaseDetailForOwnedCase';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase';
import { fakeFile, loginAs, setupTest } from './helpers';
import { userTriesToFileAnUnavailableDocumentType } from './journey/userTriesToFileAnUnavailableDocumentType';
import { PARTIES_CODES } from '@shared/business/entities/EntityConstants';

describe('an external user files a document for their legacy case', () => {
  const cerebralTest = setupTest();

  const seededDocketNumber = '999-15';

  beforeAll(() => {
    cerebralTest.docketNumber = seededDocketNumber;
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(cerebralTest);
  externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);
  userTriesToFileAnUnavailableDocumentType(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(cerebralTest);
  externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);
  userTriesToFileAnUnavailableDocumentType(cerebralTest);

  loginAs(cerebralTest, 'irspractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(cerebralTest);
  externalUserFilesDocumentForOwnedCase(cerebralTest, fakeFile);
  userTriesToFileAnUnavailableDocumentType(cerebralTest);

  loginAs(cerebralTest, 'docketclerk@example.com');
  it('verifies otherFiler parties receive paper service when serviceIndicator is set to paper', async () => {
    await cerebralTest.runSequence('gotoCaseDetailSequence', {
      docketNumber: cerebralTest.docketNumber,
    });

    const docketEntries = cerebralTest.getState('caseDetail.docketEntries');
    const lastServedDocument = docketEntries.pop();

    const isOtherFilerServed =
      lastServedDocument.servedPartiesCode === PARTIES_CODES.BOTH;

    expect(isOtherFilerServed).toBeTruthy();
  });
});
