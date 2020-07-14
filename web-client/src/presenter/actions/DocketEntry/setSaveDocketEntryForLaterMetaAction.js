/**
 * sets the state.caseDetail which is used for displaying the red alerts at the top of the page.
 *
 * @returns {object} object containing metadata for saving a docket entry for later
 */
export const setSaveDocketEntryForLaterMetaAction = () => {
  return { isSavingForLater: true, shouldGenerateCoversheet: false };
};
