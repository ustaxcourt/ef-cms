import { associatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/associatedUserViewsCaseDetailForCaseWithLegacySealedDocument';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase.js';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase.js';
import { unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument';

describe('External user views legacy sealed documents', () => {
  const seededDocketNumber = '69312-87';
  const cerebralTest = setupTest();

  beforeAll(() => {
    console.error = () => {};
    jest.setTimeout(30000);

    cerebralTest.docketNumber = seededDocketNumber;
    cerebralTest.docketEntryId = 'b868a8d3-6990-4b6b-9ccd-b04b22f075a0';
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner2@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'petitioner3@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'irsPractitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'privatePractitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);
});
