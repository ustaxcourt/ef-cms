import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { getConstants } from '../../../getConstants';
import { getFeatureFlagFactoryAction } from '../../actions/getFeatureFlagFactoryAction';
import { isFeatureFlagEnabledFactoryAction } from '../../actions/isFeatureFlagEnabledFactoryAction';
import { setAdvancedSearchResultsAction } from '../../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setAlertWarningAction } from '../../actions/setAlertWarningAction';
import { setDefaultAdvancedSearchTabAction } from '../../actions/setDefaultAdvancedSearchTabAction';
import { setFeatureFlagFactoryAction } from '../../actions/setFeatureFlagFactoryAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { submitPublicOpinionAdvancedSearchAction } from '../../actions/Public/submitPublicOpinionAdvancedSearchAction';
import { validateOpinionAdvancedSearchAction } from '../../actions/AdvancedSearch/validateOpinionAdvancedSearchAction';

export const submitPublicOpinionAdvancedSearchSequence = [
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key,
  ),
  isFeatureFlagEnabledFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH,
  ),
  {
    no: [setAlertWarningAction, setDefaultAdvancedSearchTabAction],
    yes: [
      clearSearchTermAction,
      validateOpinionAdvancedSearchAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          clearSearchResultsAction,
          startShowValidationAction,
        ],
        success: showProgressSequenceDecorator([
          clearAlertsAction,
          submitPublicOpinionAdvancedSearchAction,
          setAdvancedSearchResultsAction,
        ]),
      },
    ],
  },
];
