import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../../actions/clearSearchTermAction';
import { getConstants } from '../../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../../actions/getFeatureFlagValueFactoryAction';
import { setAdvancedSearchResultsAction } from '../../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setAlertErrorAction } from '../../actions/setAlertErrorAction';
import { setAlertWarningAction } from '../../actions/setAlertWarningAction';
import { setDefaultAdvancedSearchTabAction } from '../../actions/setDefaultAdvancedSearchTabAction';
import { setValidationErrorsAction } from '../../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../../actions/startShowValidationAction';
import { submitPublicOpinionAdvancedSearchAction } from '../../actions/Public/submitPublicOpinionAdvancedSearchAction';
import { validateOpinionAdvancedSearchAction } from '../../actions/AdvancedSearch/validateOpinionAdvancedSearchAction';

export const submitPublicOpinionAdvancedSearchSequence = [
  getFeatureFlagValueFactoryAction(
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
