import { associatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/associatedUserViewsCaseDetailForCaseWithLegacySealedDocument';
import { loginAs, setupTest } from './helpers';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkAddsRespondentsToCase } from './journey/petitionsClerkAddsRespondentsToCase';
import { unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument } from './journey/unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument';

describe('External user views legacy sealed documents', () => {
  const cerebralTest = setupTest();

  const seededDocketNumber = '69312-87';

  beforeAll(() => {
    console.error = () => {};

    cerebralTest.docketNumber = seededDocketNumber;
    cerebralTest.docketEntryId = 'cdf5a93e-abbd-4225-88df-88fc03f8af18';
  });

  afterAll(() => {
    cerebralTest.closeSocket();
  });

  loginAs(cerebralTest, 'petitioner2@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'petitioner3@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'irspractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'privatepractitioner@example.com');
  unassociatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);

  loginAs(cerebralTest, 'petitionsclerk@example.com');
  petitionsClerkAddsPractitionersToCase(cerebralTest, true);
  petitionsClerkAddsRespondentsToCase(cerebralTest);

  loginAs(cerebralTest, 'petitioner@example.com');
  associatedUserViewsCaseDetailForCaseWithLegacySealedDocument(cerebralTest);
});
