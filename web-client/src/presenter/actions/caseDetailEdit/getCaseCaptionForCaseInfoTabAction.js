import { state } from 'cerebral';

/**
 * Fetches the case caption using the getCaseCaption helper method
 *
 * @param {object} providers the providers object
 * @param {Function} providers.applicationContext application context to get Case entity
 * @param {Function} providers.get the cerebral get function
 * @param {Function} providers.props the cerebral props object
 * @returns {object} contains the caseCaption
 */
export const getCaseCaptionForCaseInfoTabAction = ({
  applicationContext,
  get,
  props,
}) => {
  const { tab } = props;

  if (tab === 'partyInfo') {
    const { Case } = applicationContext.getEntityConstructors();
    let caseCaption = Case.getCaseCaption(get(state.caseDetail)) || '';

    caseCaption += ` ${Case.CASE_CAPTION_POSTFIX}`;

    return { caseCaption };
  }
};
