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
        getFeatureFlagValueFactoryAction(
          getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH,
        ),
        {
          no: opinionSearchDisabled,
          yes: opinionsSearchEnabled,
        },
      ],
      yes: [
        getFeatureFlagValueFactoryAction(
          getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH,
        ),
        {
          no: opinionSearchDisabled,
          yes: opinionsSearchEnabled,
        },
      ],
    },
  ]);
