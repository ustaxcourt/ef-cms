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

  loginAs(test, 'docketclerk@example.com');
  it('verifies otherFiler parties receive paper service', async () => {
    await test.runSequence('gotoCaseDetailSequence', {
      docketNumber: test.docketNumber,
    });

    const otherFilers = test.getState('caseDetail.otherFilers');
    const docketEntries = test.getState('caseDetail.docketEntries');
    const lastServedDocument = docketEntries.pop();

    const isOtherFilerServed = lastServedDocument.servedParties.find(
      p => p.name === otherFilers[0].name && p.email === otherFilers[0].email,
    );

    expect(isOtherFilerServed).toBeTruthy();
  });
});
