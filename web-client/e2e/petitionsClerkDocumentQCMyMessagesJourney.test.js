import { Case } from '../../shared/src/business/entities/cases/Case';
import { CerebralTest } from 'cerebral/test';
import { Document } from '../../shared/src/business/entities/Document';
import { TrialSession } from '../../shared/src/business/entities/TrialSession';
import { applicationContext } from '../src/applicationContext';
import { isFunction, mapValues } from 'lodash';
import { presenter } from '../src/presenter/presenter';
import { withAppContextDecorator } from '../src/withAppContext';
import FormData from 'form-data';
import petitionsClerkBulkAssignsCases from './journey/petitionsClerkBulkAssignsCases';
import petitionsClerkCreatesMessage from './journey/petitionsClerkCreatesMessage';
import petitionsClerkGetsMyDocumentQCInboxCount from './journey/petitionsClerkGetsMyDocumentQCInboxCount';
import petitionsClerkGetsMyMessagesInboxCount from './journey/petitionsClerkGetsMyMessagesInboxCount';
import petitionsClerkGetsSectionDocumentQCInboxCount from './journey/petitionsClerkGetsSectionDocumentQCInboxCount';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkVerifiesAssignedWorkItem from './journey/petitionsClerkVerifiesAssignedWorkItem';
import petitionsClerkVerifiesUnreadMessage from './journey/petitionsClerkVerifiesUnreadMessage';
import petitionsClerkViewsMyDocumentQC from './journey/petitionsClerkViewsMyDocumentQC';
import petitionsClerkViewsMyMessagesInbox from './journey/petitionsClerkViewsMyMessagesInbox';
import petitionsClerkViewsSectionDocumentQC from './journey/petitionsClerkViewsSectionDocumentQC';
import petitionsClerkViewsUnreadMessage from './journey/petitionsClerkViewsUnreadMessage';
import taxPayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerAddNewCaseToTestObj from './journey/taxpayerAddNewCaseToTestObj';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogin from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerCancelsCreateCase';
const {
  ContactFactory,
} = require('../../shared/src/business/entities/contacts/ContactFactory');

let test;

global.FormData = FormData;
global.Blob = () => {};
presenter.providers.applicationContext = applicationContext;
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

const fakeData =
  'JVBERi0xLjEKJcKlwrHDqwoKMSAwIG9iagogIDw8IC9UeXBlIC9DYXRhbG9nCiAgICAgL1BhZ2VzIDIgMCBSCiAgPj4KZW5kb2JqCgoyIDAgb2JqCiAgPDwgL1R5cGUgL1BhZ2VzCiAgICAgL0tpZHMgWzMgMCBSXQogICAgIC9Db3VudCAxCiAgICAgL01lZGlhQm94IFswIDAgMzAwIDE0NF0KICA+PgplbmRvYmoKCjMgMCBvYmoKICA8PCAgL1R5cGUgL1BhZ2UKICAgICAgL1BhcmVudCAyIDAgUgogICAgICAvUmVzb3VyY2VzCiAgICAgICA8PCAvRm9udAogICAgICAgICAgIDw8IC9GMQogICAgICAgICAgICAgICA8PCAvVHlwZSAvRm9udAogICAgICAgICAgICAgICAgICAvU3VidHlwZSAvVHlwZTEKICAgICAgICAgICAgICAgICAgL0Jhc2VGb250IC9UaW1lcy1Sb21hbgogICAgICAgICAgICAgICA+PgogICAgICAgICAgID4+CiAgICAgICA+PgogICAgICAvQ29udGVudHMgNCAwIFIKICA+PgplbmRvYmoKCjQgMCBvYmoKICA8PCAvTGVuZ3RoIDg0ID4+CnN0cmVhbQogIEJUCiAgICAvRjEgMTggVGYKICAgIDUgODAgVGQKICAgIChDb25ncmF0aW9ucywgeW91IGZvdW5kIHRoZSBFYXN0ZXIgRWdnLikgVGoKICBFVAplbmRzdHJlYW0KZW5kb2JqCgp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTggMDAwMDAgbiAKMDAwMDAwMDA3NyAwMDAwMCBuIAowMDAwMDAwMTc4IDAwMDAwIG4gCjAwMDAwMDA0NTcgMDAwMDAgbiAKdHJhaWxlcgogIDw8ICAvUm9vdCAxIDAgUgogICAgICAvU2l6ZSA1CiAgPj4Kc3RhcnR4cmVmCjU2NQolJUVPRgo=';

const fakeFile = Buffer.from(fakeData, 'base64');
fakeFile.name = 'fakeFile.pdf';

test = CerebralTest(presenter);

describe('Petitions Clerk Document QC Journey', () => {
  beforeEach(() => {
    jest.setTimeout(30000);
    global.window = {
      localStorage: {
        removeItem: () => null,
        setItem: () => null,
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
      TRIAL_CITIES: TrialSession.TRIAL_CITIES,
    });
  });
  const caseCreationCount = 3;

  petitionsClerkLogIn(test);
  petitionsClerkViewsSectionDocumentQC(test, true);
  petitionsClerkViewsMyDocumentQC(test, true);
  petitionsClerkSignsOut(test);

  taxpayerLogin(test);

  // Create multiple cases for testing
  for (let i = 0; i < caseCreationCount; i++) {
    taxpayerNavigatesToCreateCase(test);
    taxpayerChoosesProcedureType(test);
    taxpayerChoosesCaseType(test);
    taxpayerCreatesNewCase(test, fakeFile);
    taxpayerAddNewCaseToTestObj(test);
  }

  taxPayerSignsOut(test);

  petitionsClerkLogIn(test);
  petitionsClerkViewsSectionDocumentQC(test);
  petitionsClerkGetsSectionDocumentQCInboxCount(test, caseCreationCount);
  petitionsClerkBulkAssignsCases(test);
  petitionsClerkViewsMyDocumentQC(test);
  petitionsClerkGetsMyDocumentQCInboxCount(test, caseCreationCount);
  petitionsClerkVerifiesAssignedWorkItem(test);
  petitionsClerkVerifiesUnreadMessage(test);
  petitionsClerkCreatesMessage(test, 'Here comes the hotstepper!');
  petitionsClerkSignsOut(test);

  petitionsClerkLogIn(test, 'petitionsclerk1');
  petitionsClerkViewsMyMessagesInbox(test, true);
  petitionsClerkGetsMyMessagesInboxCount(test);
  petitionsClerkViewsUnreadMessage(test, 'Here comes the hotstepper!');
  petitionsClerkGetsMyMessagesInboxCount(test, -1);
  petitionsClerkSignsOut(test);
});
