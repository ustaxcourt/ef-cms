import { state } from 'cerebral';

/**
 * Fetches the case caption using the getCaseCaption helper method
 *
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext application context to get Case entity
 * @param {Function} providers.get the cerebral get function
 * @returns {object} contains the caseCaption
 */
export const getInternalCaseCaptionForCaseInfoTabAction = ({
  applicationContext,
  get,
  props,
}) => {
  const { tab } = props;

  if (tab === 'caseInfo') {
    const { Case } = applicationContext.getEntityConstructors();
    let caseCaption = Case.getCaseCaption(get(state.form)) || '';

    caseCaption += ` ${Case.CASE_CAPTION_POSTFIX}`;

    return { caseCaption };
  }
};
