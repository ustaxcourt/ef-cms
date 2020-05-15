require('isomorphic-fetch');

import { fakeFile, loginAs, setupTest } from './helpers';

// docketclerk
import { docketClerkSendsStipDecisionToADC } from './journey/docketClerkSendsStipDecisionToADC';
import { docketClerkVerifiesStipulatedDecisionExistsInInbox } from './journey/docketClerkVerifiesStipulatedDecisionExistsInInbox';
import { docketClerkVerifiesStipulatedDecisionExistsInOutbox } from './journey/docketClerkVerifiesStipulatedDecisionExistsInOutbox';
import { docketClerkViewsStipulatedDecision } from './journey/docketClerkViewsStipulatedDecision';

// practitioner
import { practitionerFilesDocumentForStipulatedDecision } from './journey/practitionerFilesDocumentForStipulatedDecision';
import { practitionerViewsCaseDetail } from './journey/practitionerViewsCaseDetail';

// petitioner
import { petitionerChoosesCaseType } from './journey/petitionerChoosesCaseType';
import { petitionerChoosesProcedureType } from './journey/petitionerChoosesProcedureType';
import { petitionerCreatesNewCase } from './journey/petitionerCreatesNewCase';
import { petitionerViewsDashboard } from './journey/petitionerViewsDashboard';

// adc
import { adcVerifiesStipulatedDecisionDoesNotExistInInbox } from './journey/adcVerifiesStipulatedDecisionDoesNotExistInInbox';
import { adcVerifiesStipulatedDecisionExistsInOutbox } from './journey/adcVerifiesStipulatedDecisionExistsInOutbox';
import { adcViewsStipulatedDecisionForSigning } from './journey/adcViewsStipulatedDecisionForSigning';
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

  loginAs(test, 'petitioner');
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);

  loginAs(test, 'privatePractitioner');
  practitionerViewsCaseDetail(test);
  practitionerFilesDocumentForStipulatedDecision(test, fakeFile);

  loginAs(test, 'docketclerk');
  docketClerkViewsStipulatedDecision(test);
  docketClerkSendsStipDecisionToADC(test);

  loginAs(test, 'adc');
  adcViewsStipulatedDecisionForSigning(test);
  adcVerifiesStipulatedDecisionDoesNotExistInInbox(test);
  adcVerifiesStipulatedDecisionExistsInOutbox(test);

  loginAs(test, 'docketclerk');
  docketClerkVerifiesStipulatedDecisionExistsInOutbox(
    test,
    'Jeff, this is ready for review and signature',
  );
  docketClerkVerifiesStipulatedDecisionExistsInInbox(
    test,
    'Donna, this is not ready to serve. I need to follow up on something first',
  );
});
