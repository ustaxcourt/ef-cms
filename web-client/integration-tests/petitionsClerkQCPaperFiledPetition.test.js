import { fakeFile, loginAs, setupTest } from './helpers';
import { petitionsClerkCreatesNewCaseFromPaper } from './journey/petitionsClerkCreatesNewCaseFromPaper';
import { petitionsClerkEditsSavedPetition } from './journey/petitionsClerkEditsSavedPetition';
import { petitionsClerkRemovesAndReaddsPdfFromPetition } from './journey/petitionsClerkRemovesAndReaddsPdfFromPetition';
import { petitionsClerkReviewsPetitionAndSavesForLater } from './journey/petitionsClerkReviewsPetitionAndSavesForLater';
import { petitionsClerkViewsSectionInProgress } from './journey/petitionsClerkViewsSectionInProgress';

const test = setupTest();

describe('Petitions Clerk QCs Paper Filed Petition', () => {
  beforeAll(() => {
    jest.setTimeout(40000);
  });

  loginAs(test, 'petitionsclerk@example.com');
  petitionsClerkCreatesNewCaseFromPaper(test, fakeFile);
  petitionsClerkReviewsPetitionAndSavesForLater(test);
  petitionsClerkViewsSectionInProgress(test);
  petitionsClerkEditsSavedPetition(test);
  petitionsClerkRemovesAndReaddsPdfFromPetition(test, fakeFile);
});
