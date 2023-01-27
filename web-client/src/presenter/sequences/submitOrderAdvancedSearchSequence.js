import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearSearchResultsAction } from '../actions/AdvancedSearch/clearSearchResultsAction';
import { clearSearchTermAction } from '../actions/clearSearchTermAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { isFeatureFlagEnabledFactoryAction } from '../actions/isFeatureFlagEnabledFactoryAction';
import { isInternalUserAction } from '../actions/isInternalUserAction';
import { setAdvancedSearchResultsAction } from '../actions/AdvancedSearch/setAdvancedSearchResultsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setDefaultAdvancedSearchTabAction } from '../actions/setDefaultAdvancedSearchTabAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
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
      getFeatureFlagFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key,
      ),
      setFeatureFlagFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key,
      ),
      isFeatureFlagEnabledFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH,
      ),
      {
        no: orderSearchDisabled,
        yes: orderSearchEnabled,
      },
    ],
    yes: [
      getFeatureFlagFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key,
      ),
      setFeatureFlagFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH.key,
      ),
      isFeatureFlagEnabledFactoryAction(
        getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH,
      ),
      {
        no: orderSearchDisabled,
        yes: orderSearchEnabled,
      },
    ],
  },
]);
