import { fakeFile, setupTest } from './helpers';

// calendarClerk
import calendarClerkLogIn from './journey/calendarClerkLogIn';
import calendarClerkSignsOut from './journey/calendarClerkSignsOut';
import calendarClerkViewsDocketEntry from './journey/calendarClerkViewsDocketEntry';
// docketClerk
import docketClerkAddsDocketEntryFromOrder from './journey/docketClerkAddsDocketEntryFromOrder';
import docketClerkAddsDocketEntryFromOrderOfDismissal from './journey/docketClerkAddsDocketEntryFromOrderOfDismissal';
import docketClerkCancelsAddDocketEntryFromOrder from './journey/docketClerkCancelsAddDocketEntryFromOrder';
import docketClerkCreatesAnOrder from './journey/docketClerkCreatesAnOrder';
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkViewsCaseDetailForCourtIssuedDocketEntry from './journey/docketClerkViewsCaseDetailForCourtIssuedDocketEntry';
import docketClerkViewsDraftOrder from './journey/docketClerkViewsDraftOrder';
import docketClerkViewsSavedCourtIssuedDocketEntryInProgress from './journey/docketClerkViewsSavedCourtIssuedDocketEntryInProgress';
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

const test = setupTest();
// global.FormData = FormData;
// global.File = File;
// global.Blob = Blob;
// presenter.providers.applicationContext = applicationContext;
// presenter.providers.router = {
//   createObjectURL: () => '/test-url',
//   externalRoute: () => {},
//   route: async url => {
//     if (url === `/case-detail/${test.docketNumber}`) {
//       await test.runSequence('gotoCaseDetailSequence', {
//         docketNumber: test.docketNumber,
//       });
//     }
//
//     if (url === '/') {
//       await test.runSequence('gotoDashboardSequence');
//     }
//   },
// };
//
// presenter.state = mapValues(presenter.state, value => {
//   if (isFunction(value)) {
//     return withAppContextDecorator(value, applicationContext);
//   }
//   return value;
// });
//
// const dom = new JSDOM(`<!DOCTYPE html>
// <body>
//   <input type="file" />
// </body>`);
//
// const { window } = dom;
// const { Blob, File } = window;
//
// test = CerebralTest(presenter);

test.draftOrders = [];

// test.setState('constants', {
//   CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
//   COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
//   INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
//   MAX_FILE_SIZE_MB,
//   ORDER_TYPES_MAP: Order.ORDER_TYPES,
//   PARTY_TYPES: ContactFactory.PARTY_TYPES,
//   STATUS_TYPES: Case.STATUS_TYPES,
//   TRIAL_CITIES: TrialSession.TRIAL_CITIES,
//   USER_ROLES: User.ROLES,
// });

describe('Docket Clerk Adds Court-Issued Order to Docket Record', () => {
  // -- setup --
  // petitioner creates a case
  petitionerLogin(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test, { procedureType: 'Regular' });
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerSignsOut(test);
  // docketClerk logs in
  docketClerkLogIn(test);
  // docketClerk navigates to newly created case
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
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
  petitionsClerkViewsCaseDetail(test, 3);
  // x.petitionsClerk clicks on draft documents tab
  // x.petitionsClerk clicks on first-created order
  // = NO "Add Docket Entry" button
  petitionsClerkViewsDraftOrder(test, 0);
  // petitionsClerk logs out
  petitionsClerkSignsOut(test);

  // Scenario 2
  // docketClerk logs in
  docketClerkLogIn(test);
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  // x.docketClerk clicks on draft documents tab
  // x.docketClerk clicks on first-created order
  // = "Add Docket Entry" button visisble
  docketClerkViewsDraftOrder(test, 0);

  // Scenario 3
  // docketClerk clicks Add Docket Entry button
  // docketClerk sees Add Docket Entry screen with the expected Order document
  docketClerkAddsDocketEntryFromOrder(test, 0);

  // x.Scenario 4a
  // Form defaults to "O" code documentType
  // freeText populated with Order title

  // x.Scenario 4b
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  // docketClerk clicks on draft documents tab
  // docketClerk  clicks on second-created order
  // Form defaults to "OD" code
  // "Judge Name" field is displayed with empty state
  // = freeText is empty

  // x.Scenario 5
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
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

  // x.Scenario 10
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  // docketClerk clicks on draft documents tab
  // docketClerk clicks on second-created order
  docketClerkViewsDraftOrder(test, 1);
  docketClerkCancelsAddDocketEntryFromOrder(test, 1);
  docketClerkViewsDraftOrder(test, 1);
  docketClerkAddsDocketEntryFromOrderOfDismissal(test, 1);
  // docketClerk selects Judge Buch as Judge
  // docketClerk sets freeText to "for something"
  // docketClerk checks "Attachments" checkbox
  // docketClerk clicks save
  // = navigates to caseDetail
  // = newly-created docket entry exists on docket record
  // = docket entry is in incomplete status
  // = title is "Order of Dismissal Entered, Judge Buch for Something (Attachment(s))"

  // x.Scenario 11 (handled above in Scenario 10)
  // docketClerk navigates to case detail
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
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  // docketClerk clicks on draft documents tab
  // docketClerk clicks on second-created order
  // docketClerk clicks save
  // = navigates to caseDetail
  // = newly-created docket entry exists on docket record
  // = docket entry is in incomplete status
  // = title is "Order to do something"

  // Scenario 13
  // docketClerk clicks on "Order to do something"
  docketClerkViewsSavedCourtIssuedDocketEntryInProgress(test, 1);
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
  calendarClerkViewsDocketEntry(test, 1);
  // = Document Detail view is displayed
  // = concat'd document is displayed as page title
  // = current document is displayed in pdf viewer
  // calendarClerk logs out
  calendarClerkSignsOut(test);

  // x.Scenario 15
  // petitioner logs in
  petitionerLogin(test);
  // petitioner navigates to case
  petitionerViewsCaseDetail(test, 3);
  // petitioner views docket record
  // = saved order visible on docket record
  // = saved order link is NOT clickable
  // petitioner logs out
  petitionerSignsOut(test);

  // Scenario 16
  // docketClerk logs in
  docketClerkLogIn(test);
  // docketClerk navigates to case detail
  docketClerkViewsCaseDetailForCourtIssuedDocketEntry(test);
  // docketClerk clicks on draft documents tab
  // docketClerk  clicks on second-created order
  // Form defaults to "OD" code
  // "Judge Name" field is displayed with empty state
  // = freeText is empty
  // = Docket Entry preview displays " Order of Dismissal Entered, Judge Buch for Something (Attachment(s))"
});
