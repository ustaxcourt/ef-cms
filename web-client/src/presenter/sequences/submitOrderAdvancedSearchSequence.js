import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
import { isInternalUserAction } from '../actions/isInternalUserAction';
import { setAdvancedSearchResultsAction } from '../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setDefaultAdvancedSearchTabAction } from '../actions/setDefaultAdvancedSearchTabAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { submitOrderAdvancedSearchAction } from '../actions/AdvancedSearch/submitOrderAdvancedSearchAction';
import { validateOrderAdvancedSearchAction } from '../actions/AdvancedSearch/validateOrderAdvancedSearchAction';

const orderSearchDisabled = [
  setAlertWarningAction,
  setDefaultAdvancedSearchTabAction,
];

const orderSearchEnabled = [
  clearSearchTermAction,
  validateOrderAdvancedSearchAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      clearSearchResultsAction,
      startShowValidationAction,
    ],
    success: [
      clearAlertsAction,
      submitOrderAdvancedSearchAction,
      setAdvancedSearchResultsAction,
    ],
  },
];

export const submitOrderAdvancedSearchSequence = showProgressSequenceDecorator([
  isInternalUserAction,
  {
    no: [
      getFeatureFlagValueFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH,
      ),
      {
        no: orderSearchDisabled,
        yes: orderSearchEnabled,
      },
    ],
    yes: [
      getFeatureFlagValueFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH,
      ),
      {
        no: orderSearchDisabled,
        yes: orderSearchEnabled,
      },
    ],
  },
]);
