import { chooseByTruthyStateActionFactory } from '../editUploadCourtIssuedDocument/chooseByTruthyStateActionFactory';

/**
 * allow navigation if the caseDetail is filled in. This is to prevent refresh staying on the page.
 */
export const canNavigateToReviewSavedPetitionScreenAction = chooseByTruthyStateActionFactory(
  'form.partyType',
);
