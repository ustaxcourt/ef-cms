// calendarClerk
import calendarClerkLogIn from './journey/calendarClerkLogIn';
import calendarClerkSignsOut from './journey/calendarClerkSignsOut';

// docketClerk
import docketClerkAddsDocketEntryFromOrder from './journey/docketClerkAddsDocketEntryFromOrder';
import docketClerkCreatesAnOrder from './journey/docketClerkCreatesAnOrder';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkViewsCaseDetail from './journey/docketClerkViewsCaseDetail';
import docketClerkViewsDraftOrder from './journey/docketClerkViewsDraftOrder';
// petitionsClerk
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkViewsCaseDetail from './journey/petitionsClerkViewsCaseDetail';
import petitionsClerkViewsDraftOrder from './journey/petitionsClerkViewsDraftOrder';
// petitioner
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogin from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerCancelsCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsCaseDetail from './journey/petitionerViewsCaseDetail';

let test;

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  // -- setup --
  // petitioner creates a case
  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile, { caseType: 'CDP (Lien/Levy)' });
  petitionerSignsOut(test);
  // docketClerk logs in
  docketClerkLogIn(test);
  // docketClerk navigates to newly created case
  docketClerkViewsCaseDetail(test);
  // docketClerk creates an order (type Order, freeText "Order to do something")
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order to do something',
    eventCode: 'O',
    expectedDocumentType: 'Order',
  });
  // docketClerk creates an order (type "Order for Dismissal")
  docketClerkCreatesAnOrder(test, {
    documentTitle: 'Order of Dismissal',
    eventCode: 'OD',
    expectedDocumentType: 'Order of Dismissal',
  });
  // docketClerk logs out
  docketClerkSignsOut(test);

  // Scenario 1
  // petitionsClerk logs in
  petitionsClerkLogIn(test);
  // petitionsClerk navigates to case detail
  petitionsClerkViewsCaseDetail(test);
  // x.petitionsClerk clicks on draft documents tab
  // x.petitionsClerk clicks on first-created order
  // = NO "Add Docket Entry" button
  petitionsClerkViewsDraftOrder(test, documentId);
  // petitionsClerk logs out
  petitionsClerkSignsOut(test);

  // Scenario 2
  // docketClerk logs in
  docketClerkLogIn(test);
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetail(test);
  // x.docketClerk clicks on draft documents tab
  // x.docketClerk clicks on first-created order
  // = "Add Docket Entry" button visisble
  docketClerkViewsDraftOrder(test, documentId);

  // Scenario 3
  // docketClerk clicks Add Docket Entry button
  // docketClerk sees Add Docket Entry screen with the expected Order document
  docketClerkAddsDocketEntryFromOrder(test, documentId);

  // x.Scenario 4a
  // Form defaults to "O" code documentType
  // freeText populated with Order title

  // x.Scenario 4b
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetail(test);
  // docketClerk clicks on draft documents tab
  // docketClerk  clicks on second-created order
  // Form defaults to "OD" code
  // "Judge Name" field is displayed with empty state
  // = freeText is empty

  // x.Scenario 5
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetail(test);
  // docketClerk clicks on draft documents tab
  // docketClerk clicks on first-created order
  // docketClerk changes documentType to "OCA"
  // freeText is empty

  // x.Scenario 6
  // docketClerk changes documentType to "OAJ"
  // "Judge's Name" field is displayed with empty state
  // freeText is empty

  // x.Scenario 7
  // docketClerk changes documentType to "OAL"
  // "Docket Numbers" field is displayed with empty state
  // freeText is hidden

  // x.Scenario 8
  // docketClerk changes documentType to "OAP"
  // "Date" field displays with empty state
  // freeText is empty

  // x.Scenario 9
  // docketClerk changes documentType to "OOD"
  // "Date" field displays with empty state
  // freeText is hidden

  // Scenario 10
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetail(test);
  // docketClerk clicks on draft documents tab
  // docketClerk clicks on second-created order
  // docketClerk selects Judge Buch as Judge
  // docketClerk sets freeText to "for something"
  // docketClerk checks "Attachments" checkbox
  // docketClerk clicks save
  // = navigates to caseDetail
  // = newly-created docket entry exists on docket record
  // = docket entry is in incomplete status
  // = title is "Order of Dismissal Entered, Judge Buch for Something (Attachment(s))"

  // Scenario 11
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetail(test);
  // docketClerk clicks on draft documents tab
  // docketClerk clicks on first-created order
  // docketClerk clicks cancel
  // = confirmation modal displays
  // docketClerk confirms cancel
  // = modal closes
  // = navigates to caseDetail
  // docketClerk clicks on draft documents tab
  // = first-created order exists in draft documents

  // Scenario 12
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetail(test);
  // docketClerk clicks on draft documents tab
  // docketClerk clicks on second-created order
  // docketClerk clicks save
  // = navigates to caseDetail
  // = newly-created docket entry exists on docket record
  // = docket entry is in incomplete status
  // = title is "Order to do something"

  // Scenario 13
  // docketClerk clicks on "Order to do something"
  // = Edit Docket Entry view is displayed
  // = "incomplete" alert is displayed
  // = documentType is set to "O"
  // = freeText is set to "Order to do something"
  // docketClerk logs out
  docketClerkSignsOut(test);

  // Scenario 14
  // calendarClerk signs in
  calendarClerkLogIn(test);
  // calendarClerk navigates to case
  // calendarClerk views docket record
  // calendarClerk clicks on "Order to do something"
  // = Document Detail view is displayed
  // = concat'd document is displayed as page title
  // = current document is displayed in pdf viewer
  // calendarClerk logs out
  calendarClerkSignsOut(test);

  // Scenario 15
  // petitioner logs in
  petitionerLogin(test);
  // petitioner navigates to case
  petitionerViewsCaseDetail(test);
  // petitioner views docket record
  // = saved order visible on docket record
  // = saved order link is NOT clickable
  // petitioner logs out
  petitionerSignsOut(test);

  // Scenario 16
  // docketClerk logs in
  docketClerkLogIn(test);
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetail(test);
  // docketClerk clicks on draft documents tab
  // docketClerk  clicks on second-created order
  // Form defaults to "OD" code
  // "Judge Name" field is displayed with empty state
  // = freeText is empty
  // = Docket Entry preview displays " Order of Dismissal Entered, Judge Buch for Something (Attachment(s))"
});
