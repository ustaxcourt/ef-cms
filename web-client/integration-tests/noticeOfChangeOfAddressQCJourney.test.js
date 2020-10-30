import { docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService } from './journey/docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService';
import { docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner } from './journey/docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner';
import { docketClerkEditsServiceIndicatorForPetitioner } from './journey/docketClerkEditsServiceIndicatorForPetitioner';
import { docketClerkQCsNCAForCaseWithPaperService } from './journey/docketClerkQCsNCAForCaseWithPaperService';
import { loginAs, setupTest, uploadPetition } from './helpers';
import { petitionerEditsCasePrimaryContactAddress } from './journey/petitionerEditsCasePrimaryContactAddress';
import { petitionerNavigatesToEditPrimaryContact } from './journey/petitionerNavigatesToEditPrimaryContact';
import { petitionsClerkAddsPractitionersToCase } from './journey/petitionsClerkAddsPractitionersToCase';
import { petitionsClerkViewsCaseDetail } from './journey/petitionsClerkViewsCaseDetail';
import { practitionerUpdatesAddress } from './journey/practitionerUpdatesAddress';

const test = setupTest();
test.draftOrders = [];

describe('noticeOfChangeOfAddressQCJourney', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  loginAs(test, 'petitioner@example.com');
  it('Create test case', async () => {
    const caseDetail = await uploadPetition(test);
    expect(caseDetail.docketNumber).toBeDefined();
    expect(caseDetail.privatePractitioners).toEqual([]);
    test.docketNumber = caseDetail.docketNumber;
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkViewsCaseDetail(test);
  petitionsClerkAddsPractitionersToCase(test);

  loginAs(test, 'petitioner@example.com');
  petitionerNavigatesToEditPrimaryContact(test);
  petitionerEditsCasePrimaryContactAddress(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkDoesNotViewQCItemForNCAForRepresentedPetitioner(test);

  loginAs(test, 'privatePractitioner@example.com');
  practitionerUpdatesAddress(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkDoesNotViewQCItemForNCAForCaseWithNoPaperService(test);
  docketClerkEditsServiceIndicatorForPetitioner(test);

  loginAs(test, 'privatePractitioner@example.com');
  practitionerUpdatesAddress(test);

  loginAs(test, 'docketclerk@example.com');
  docketClerkQCsNCAForCaseWithPaperService(test);
});
