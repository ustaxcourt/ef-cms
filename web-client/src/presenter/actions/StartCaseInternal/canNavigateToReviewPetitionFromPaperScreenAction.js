import { chooseByTruthyStateActionFactory } from '../editUploadCourtIssuedDocument/chooseByTruthyStateActionFactory';

/**
 * allow navigation if the form is filled in. This is to prevent refresh staying on the page.
 */
export const canNavigateToReviewPetitionFromPaperScreenAction = chooseByTruthyStateActionFactory(
  'form.partyType',
);
