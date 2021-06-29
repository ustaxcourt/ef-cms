import { associatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/associatedUserViewsCaseDetailForCaseWithLegacySealedDocument';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase.js';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase.js';
import { unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument';

describe('External user views legacy sealed documents', () => {
  const seededDocketNumber = '69312-87';
  const test = setupTest();

  beforeAll(() => {
    console.error = () => {};
    jest.setTimeout(30000);

    test.docketNumber = seededDocketNumber;
    test.docketEntryId = 'b868a8d3-6990-4b6b-9ccd-b04b22f075a0';
  });

  afterAll(() => {
    test.closeSocket();
  });

  loginAs(test, 'petitioner2@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'petitioner3@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'irsPractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'privatePractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(test, true);
  petitionsClerkAddsRespondentsToCase(test);

  loginAs(test, 'petitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'irsPractitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);

  loginAs(test, 'privatePractitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(test);
});
