import { associatedExternalUserViewsCaseDetailForOwnedCase } from './journey/associatedExternalUserViewsCaseDetailForOwnedCase.js';
import { externalUserFilesDocumentForOwnedCase } from './journey/externalUserFilesDocumentForOwnedCase.js';
import { fakeFile, loginAs, setupTest } from './helpers';

const test = setupTest();

describe('an external user files a document for their legacy case', () => {
  const seededDocketNumber = '999-15';

  beforeAll(() => {
    jest.setTimeout(30000);
    test.docketNumber = seededDocketNumber;
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(test);
  externalUserFilesDocumentForOwnedCase(test, fakeFile);

  loginAs(test, 'privatePractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(test);
  externalUserFilesDocumentForOwnedCase(test, fakeFile);

  loginAs(test, 'irsPractitioner@example.com');
  associatedExternalUserViewsCaseDetailForOwnedCase(test);
  externalUserFilesDocumentForOwnedCase(test, fakeFile);
});
