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

// petitioner
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogIn from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerNavigatesToCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';

// adc
import adcLogIn from './journey/adcLogIn';
import adcSignsOut from './journey/adcSignsOut';
import adcVerifiesStipulatedDecisionDoesNotExistInInbox from './journey/adcVerifiesStipulatedDecisionDoesNotExistInInbox';
import adcVerifiesStipulatedDecisionExistsInOutbox from './journey/adcVerifiesStipulatedDecisionExistsInOutbox';
import adcViewsStipulatedDecisionForSigning from './journey/adcViewsStipulatedDecisionForSigning';

const test = setupTest({
  useCases: {
    loadPDFForSigningInteractor: () => Promise.resolve(null),
  },
});

describe('Sr. Attorney Signs Proposed Stipulated Decision', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
    global.window.pdfjsObj = {
      getData: () => Promise.resolve(new Uint8Array(fakeFile)),
    };
  });

  petitionerLogIn(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerSignsOut(test);

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
