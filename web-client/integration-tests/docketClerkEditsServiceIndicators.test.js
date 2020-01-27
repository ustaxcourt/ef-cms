import { loginAs, setupTest, uploadPetition } from './helpers';

import docketClerkAddsDocketEntryFromOrder from './journey/docketClerkAddsDocketEntryFromOrder';
import docketClerkCreatesAnOrder from './journey/docketClerkCreatesAnOrder';
import docketClerkEditsServiceIndicatorForPetitioner from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import docketClerkEditsServiceIndicatorForPractitioner from './journey/docketClerkEditsServiceIndicatorForPractitioner';
import docketClerkEditsServiceIndicatorForRespondent from './journey/docketClerkEditsServiceIndicatorForRespondent';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkServesOrderOnPaperParties from './journey/docketClerkServesOrderOnPaperParties';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import petitionsClerkAddsPractitionersToCase from './journey/petitionsClerkAddsPractitionersToCase';
import petitionsClerkAddsRespondentsToCase from './journey/petitionsClerkAddsRespondentsToCase';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';

const test = setupTest();
test.draftOrders = [];

describe('Docket Clerk edits service indicators for petitioner, practitioner, and respondent', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  it('login as a petitioner and create a case', async () => {
    await loginAs(test, 'petitioner');
    const caseDetail = await uploadPetition(test);
    test.docketNumber = caseDetail.docketNumber;
  });

  petitionsClerkLogIn(test);
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test);
  petitionsClerkAddsRespondentsToCase(test);
  petitionsClerkSignsOut(test);

  docketClerkLogIn(test);
  docketClerkEditsServiceIndicatorForPetitioner(test);
  docketClerkEditsServiceIndicatorForPractitioner(test);
  docketClerkEditsServiceIndicatorForRespondent(test);
  // create an order to serve - it should be served to 3 paper service parties now
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  docketClerkAddsDocketEntryFromOrder(test, 0);
  docketClerkServesOrderOnPaperParties(test, 0);
  docketClerkSignsOut(test);
});
