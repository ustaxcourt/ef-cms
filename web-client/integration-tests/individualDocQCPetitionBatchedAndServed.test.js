import { fakeFile, setupTest } from './helpers';
import petitionerChoosesCaseType from './journey/petitionerChoosesCaseType';
import petitionerChoosesProcedureType from './journey/petitionerChoosesProcedureType';
import petitionerCreatesNewCase from './journey/petitionerCreatesNewCase';
import petitionerLogIn from './journey/petitionerLogIn';
import petitionerNavigatesToCreateCase from './journey/petitionerNavigatesToCreateCase';
import petitionerSignsOut from './journey/petitionerSignsOut';
import petitionerViewsDashboard from './journey/petitionerViewsDashboard';
import petitionsClerkAssignsWorkItemToSelf from './journey/petitionsClerkAssignsWorkItemToSelf';
import petitionsClerkIrsHoldingQueue from './journey/petitionsClerkIrsHoldingQueue';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsIrsBatch from './journey/petitionsClerkRunsIrsBatch';
import petitionsClerkSelectsFirstPetitionOnMyDocumentQC from './journey/petitionsClerkSelectsFirstPetitionOnMyDocumentQC';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkViewsMyDocumentQC from './journey/petitionsClerkViewsMyDocumentQC';
import petitionsClerkViewsSectionDocumentQC from './journey/petitionsClerkViewsSectionDocumentQC';

const test = setupTest();

describe('INDIVIDUAL DOC QC: Petition Gets Batched and Served', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  petitionerLogIn(test);
  petitionerNavigatesToCreateCase(test);
  petitionerChoosesProcedureType(test);
  petitionerChoosesCaseType(test);
  petitionerCreatesNewCase(test, fakeFile);
  petitionerViewsDashboard(test);
  petitionerSignsOut(test);
  petitionsClerkLogIn(test);
  petitionsClerkViewsSectionDocumentQC(test);
  petitionsClerkAssignsWorkItemToSelf(test);
  petitionsClerkViewsMyDocumentQC(test);
  petitionsClerkSelectsFirstPetitionOnMyDocumentQC(test);
  petitionsClerkSubmitsCaseToIrs(test);
  petitionsClerkIrsHoldingQueue(test);
  petitionsClerkRunsIrsBatch(test);
  petitionsClerkSignsOut(test);
});
