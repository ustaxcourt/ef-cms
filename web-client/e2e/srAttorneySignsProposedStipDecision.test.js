require('isomorphic-fetch');

const {
  ContactFactory,
} = require('../../shared/src/business/entities/contacts/ContactFactory');
import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { Document } from '../../shared/src/business/entities/Document';
import { TrialSession } from '../../shared/src/business/entities/TrialSession';
import { applicationContext } from '../src/applicationContext';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';
import FormData from 'form-data';

// docketclerk
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSendsStipDecisionToSrAttorney from './journey/docketClerkSendsStipDecisionToSrAttorney';
import docketClerkSignsOut from './journey/docketClerkSignsOut';
import docketClerkVerifiesStipulatedDecisionExistsInInbox from './journey/docketClerkVerifiesStipulatedDecisionExistsInInbox';
import docketClerkVerifiesStipulatedDecisionExistsInOutbox from './journey/docketClerkVerifiesStipulatedDecisionExistsInOutbox';
import docketClerkViewsStipulatedDecision from './journey/docketClerkViewsStipulatedDecision';

// practitioner
import practitionerFilesDocumentForStipulatedDecision from './journey/practitionerFilesDocumentForStipulatedDecision';
import practitionerLogin from './journey/practitionerLogIn';
import practitionerSignsOut from './journey/practitionerSignsOut';
import practitionerViewsCaseDetail from './journey/practitionerViewsCaseDetail';

// taxpayer
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogIn from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerNavigatesToCreateCase';
import taxpayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';

// seniorattorney
import seniorAttorneyLogIn from './journey/seniorAttorneyLogIn';
import seniorAttorneySignsOut from './journey/seniorAttorneySignsOut';
import seniorAttorneyVerifiesStipulatedDecisionDoesNotExistInInbox from './journey/seniorAttorneyVerifiesStipulatedDecisionDoesNotExistInInbox';
import seniorAttorneyVerifiesStipulatedDecisionExistsInOutbox from './journey/seniorAttorneyVerifiesStipulatedDecisionExistsInOutbox';
import seniorAttorneyViewsStipulatedDecisionForSigning from './journey/seniorAttorneyViewsStipulatedDecisionForSigning';

let test;

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
presenter.providers.applicationContext = {
  ...applicationContext,
  getUseCases: () => {
    return {
      ...applicationContext.getUseCases(),
      loadPDFForSigning: () => {
        return new Promise(resolve => {
          resolve(null);
        });
      },
    };
  },
};

presenter.providers.router = {
  externalRoute: () => null,
  route: async url => {
    if (url === '/document-qc/section/inbox') {
      await test.runSequence('gotoDashboardSequence', {
        box: 'inbox',
        queue: 'section',
        workQueueIsInternal: false,
      });
    }

    if (url === '/document-qc/my/inbox') {
      await test.runSequence('gotoDashboardSequence', {
        box: 'inbox',
        queue: 'my',
        workQueueIsInternal: false,
      });
    }

    if (url === '/messages/my/inbox') {
      await test.runSequence('gotoDashboardSequence', {
        box: 'inbox',
        queue: 'my',
        workQueueIsInternal: true,
      });
    }

    if (url === `/case-detail/${test.docketNumber}`) {
      await test.runSequence('gotoCaseDetailSequence', {
        docketNumber: test.docketNumber,
      });
    }

    if (url === '/') {
      await test.runSequence('gotoDashboardSequence');
    }
  },
};

presenter.state = mapValues(presenter.state, value => {
  if (isFunction(value)) {
    return withAppContextDecorator(value, applicationContext);
  }
  return value;
});

test = CerebralTest(presenter);

describe('Sr. Attroney Signs Proposed Stipulated Decision', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
      },
      pdfjsObj: {
        getData: () => {
          return new Promise(resolve => {
            resolve(new Uint8Array(fakeFile));
          });
        },
      },
    };

    test.setState('constants', {
      CASE_CAPTION_POSTFIX: Case.CASE_CAPTION_POSTFIX,
      CATEGORIES: Document.CATEGORIES,
      CATEGORY_MAP: Document.CATEGORY_MAP,
      COUNTRY_TYPES: ContactFactory.COUNTRY_TYPES,
      DOCUMENT_TYPES_MAP: Document.initialDocumentTypes,
      INTERNAL_CATEGORY_MAP: Document.INTERNAL_CATEGORY_MAP,
      PARTY_TYPES: ContactFactory.PARTY_TYPES,
      STATUS_TYPES: Case.STATUS_TYPES,
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
    });
  });

  taxpayerLogIn(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerSignsOut(test);

  // Practitioner1 logs into the system
  practitionerLogin(test);
  // Practitioner1 navigates to case
  practitionerViewsCaseDetail(test);
  // Practitioner1 selects File a Document
  // Practitioner1 selects “Decisions” from Document Category dropdown
  // Practitioner1 selects “Proposed Stipulated Decision” from Document Type dropdown
  // Practitioner1 selects “Select” button
  // Practitioner1 selects “Continue” button
  // Practitioner1 selects “Choose File” button and uploads proposed stipulated decision
  // Practitioner1 selects “No” to question “Does your file include a certificate of service?”
  // Practitioner1 selects “No” to question “Does your filing include exhibits?”
  // Practitioner1 selects “No” to question “Does your filing include attachments?”
  // Practitioner1 selects “No” to question “Do you have any supporting documents for this filing?”
  // Practitioner1 selects “Myself as Petitioner’s Counsel” to question “Who is filing this document.”
  // Practitioner1 selects “Review FIling” button
  // Practitioner1 selects “Submit Your Filing” button
  practitionerFilesDocumentForStipulatedDecision(test, fakeFile);
  // Practitioner1 logs out
  practitionerSignsOut(test);
  // Docketclerk1 logs in
  docketClerkLogIn(test);
  // Docketclerk1 navigates to Document QC>Section Documents
  // Docketclerk1 selects Proposed Stipulated Decision
  docketClerkViewsStipulatedDecision(test);
  // Docketclerk1 selects Create Message
  // Docketclerk1 selects Senior Attorney from Select Section dropdown
  // Docketclerk1 selects Test seniorattorney1 from the Select Recipient dropdown
  // Docketclerk1 types “Jeff, this is ready for review and signature” into the Add Message field
  // Docketclerk1 selects Send
  docketClerkSendsStipDecisionToSrAttorney(test);
  // Docketclerk1 logs out
  docketClerkSignsOut(test);
  // Seniorattorney1 logs in
  seniorAttorneyLogIn(test);
  // Seniorattorney1 selects Proposed Stipulated Decision message sent by docketclerk1
  // Seniorattorney1 selects Add Signature Button
  // Seniorattorney1 selects Apply Signature Button
  // Seniorattorney1 hovers over document and clicks to place signature on the document
  // Seniorattorney1 selects Docket from Select Section dropdown
  // Seniorattorney1 selects docketclerk1 from Select Recipient dropdown
  // Seniorattorney1 types “Donna, this is not ready to serve. I need to follow up on something first” in the Add Messages field
  // Seniorattorney1 selects Save
  seniorAttorneyViewsStipulatedDecisionForSigning(test);
  // Seniorattorney1 is auto-directed to the Case Detail Page after finishing the signature process
  // Seniorattorney1 navigates to My Messages>Inbox
  // Seniorattorney1 does not see the Proposed Stipulated Decision message from the docket clerk in the inbox
  seniorAttorneyVerifiesStipulatedDecisionDoesNotExistInInbox(test);
  // Seniorattorney1 navigates to sent box and sees Signed Stipulated Decision
  // Seniorattorney1 selects Signed Stipulated Decision and sees the message they generated to docketclerk1 during the signature process “Donna, this is not ready to serve. I need to follow up on something first”
  seniorAttorneyVerifiesStipulatedDecisionExistsInOutbox(test);
  // SeniorAttorney1 logs out
  seniorAttorneySignsOut(test);
  // Docketclerk1 logs in
  docketClerkLogIn(test);
  // Docketclerk1 navigates to My Messages>Sent and sees the Proposed Stipulated Decision
  // Docketclerk1 selects Proposed Stipulated Decision, then selects Complete Tab and sees that the message to senior has been completed (automatically when sr attorney applies signature) “Jeff, this is ready for review and signature”
  docketClerkVerifiesStipulatedDecisionExistsInOutbox(
    test,
    'Jeff, this is ready for review and signature',
  );
  // Docketclerk1 navigates to My Messages>Inbox and sees Signed Stipulated Decision message from Sr. Attorney “Donna, this is not ready to serve. I need to follow up on something first”
  docketClerkVerifiesStipulatedDecisionExistsInInbox(
    test,
    'Donna, this is not ready to serve. I need to follow up on something first',
  );
  // Docketclerk1 select Signed Stipulated Decision and sees the document in draft form
  // Docketclerk1 logs out
  docketClerkSignsOut(test);
});
