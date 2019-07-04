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

  practitionerLogin(test);
  practitionerViewsCaseDetail(test);
  practitionerFilesDocumentForStipulatedDecision(test, fakeFile);
  practitionerSignsOut(test);

  docketClerkLogIn(test);
  docketClerkViewsStipulatedDecision(test);
  docketClerkSendsStipDecisionToSrAttorney(test);
  docketClerkSignsOut(test);

  seniorAttorneyLogIn(test);
  seniorAttorneyViewsStipulatedDecisionForSigning(test);
  seniorAttorneyVerifiesStipulatedDecisionDoesNotExistInInbox(test);
  seniorAttorneyVerifiesStipulatedDecisionExistsInOutbox(test);
  seniorAttorneySignsOut(test);

  docketClerkLogIn(test);
  docketClerkVerifiesStipulatedDecisionExistsInOutbox(
    test,
    'Jeff, this is ready for review and signature',
  );
  docketClerkVerifiesStipulatedDecisionExistsInInbox(
    test,
    'Donna, this is not ready to serve. I need to follow up on something first',
  );
  docketClerkSignsOut(test);
});
