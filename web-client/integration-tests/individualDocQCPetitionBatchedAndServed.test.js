import { fakeFile, setupTest } from './helpers';
import petitionsClerkAssignsWorkItemToSelf from './journey/petitionsClerkAssignsWorkItemToSelf';
import petitionsClerkIrsHoldingQueue from './journey/petitionsClerkIrsHoldingQueue';
import petitionsClerkLogIn from './journey/petitionsClerkLogIn';
import petitionsClerkRunsIrsBatch from './journey/petitionsClerkRunsIrsBatch';
import petitionsClerkSelectsFirstPetitionOnMyDocumentQC from './journey/petitionsClerkSelectsFirstPetitionOnMyDocumentQC';
import petitionsClerkSignsOut from './journey/petitionsClerkSignsOut';
import petitionsClerkSubmitsCaseToIrs from './journey/petitionsClerkSubmitsCaseToIrs';
import petitionsClerkViewsMyDocumentQC from './journey/petitionsClerkViewsMyDocumentQC';
import petitionsClerkViewsSectionDocumentQC from './journey/petitionsClerkViewsSectionDocumentQC';
import taxpayerChoosesCaseType from './journey/taxpayerChoosesCaseType';
import taxpayerChoosesProcedureType from './journey/taxpayerChoosesProcedureType';
import taxpayerCreatesNewCase from './journey/taxpayerCreatesNewCase';
import taxpayerLogIn from './journey/taxpayerLogIn';
import taxpayerNavigatesToCreateCase from './journey/taxpayerNavigatesToCreateCase';
import taxpayerSignsOut from './journey/taxpayerSignsOut';
import taxpayerViewsDashboard from './journey/taxpayerViewsDashboard';

const test = setupTest();

describe('INDIVIDUAL DOC QC: Petition Gets Batched and Served', () => {
  beforeAll(() => {
    jest.setTimeout(30000);
  });

  taxpayerLogIn(test);
  taxpayerNavigatesToCreateCase(test);
  taxpayerChoosesProcedureType(test);
  taxpayerChoosesCaseType(test);
  taxpayerCreatesNewCase(test, fakeFile);
  taxpayerViewsDashboard(test);
  taxpayerSignsOut(test);
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
