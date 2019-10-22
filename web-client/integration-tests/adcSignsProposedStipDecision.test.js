require('isomorphic-fetch');

import { fakeFile, setupTest } from './helpers';

// docketclerk
import docketClerkLogIn from './journey/docketClerkLogIn';
import docketClerkSendsStipDecisionToADC from './journey/docketClerkSendsStipDecisionToADC';
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

// adc
import adcLogIn from './journey/adcLogIn';
import adcSignsOut from './journey/adcSignsOut';
import adcVerifiesStipulatedDecisionDoesNotExistInInbox from './journey/adcVerifiesStipulatedDecisionDoesNotExistInInbox';
import adcVerifiesStipulatedDecisionExistsInOutbox from './journey/adcVerifiesStipulatedDecisionExistsInOutbox';
import adcViewsStipulatedDecisionForSigning from './journey/adcViewsStipulatedDecisionForSigning';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => {
      return new Promise(resolve => {
        resolve(null);
      });
    },
  },
});

describe('Sr. Attorney Signs Proposed Stipulated Decision', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => {
        return new Promise(resolve => {
          resolve(new Uint8Array(fakeFile));
        });
      },
    };
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
  docketClerkSendsStipDecisionToADC(test);
  docketClerkSignsOut(test);

  adcLogIn(test);
  adcViewsStipulatedDecisionForSigning(test);
  adcVerifiesStipulatedDecisionDoesNotExistInInbox(test);
  adcVerifiesStipulatedDecisionExistsInOutbox(test);
  adcSignsOut(test);

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
