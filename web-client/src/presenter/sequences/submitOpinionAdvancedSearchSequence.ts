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
import { submitOpinionAdvancedSearchAction } from '../actions/AdvancedSearch/submitOpinionAdvancedSearchAction';
import { validateOpinionAdvancedSearchAction } from '../actions/AdvancedSearch/validateOpinionAdvancedSearchAction';

const opinionSearchDisabled = [
  setAlertWarningAction,
  setDefaultAdvancedSearchTabAction,
];

const opinionsSearchEnabled = [
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
      submitOpinionAdvancedSearchAction,
      setAdvancedSearchResultsAction,
    ]),
  },
];

export const submitOpinionAdvancedSearchSequence =
  showProgressSequenceDecorator([
    isInternalUserAction,
    {
      no: [
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
          no: opinionSearchDisabled,
          yes: opinionsSearchEnabled,
        },
      ],
      yes: [
        getFeatureFlagFactoryAction(
          getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key,
        ),
        setFeatureFlagFactoryAction(
          getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH.key,
        ),
        isFeatureFlagEnabledFactoryAction(
          getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH,
        ),
        {
          no: opinionSearchDisabled,
          yes: opinionsSearchEnabled,
        },
      ],
    },
  ]);
