import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { defaultAdvancedSearchFormAction } from '../../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getConstants } from '../../../getConstants';
import { getFeatureFlagFactoryAction } from '../../actions/getFeatureFlagFactoryAction';
import { getOpinionTypesAction } from '../../actions/getOpinionTypesAction';
import { getPublicJudgesAction } from '../../actions/Public/getPublicJudgesAction';
import { setAllAndCurrentJudgesAction } from '../../actions/setAllAndCurrentJudgesAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setFeatureFlagFactoryAction } from '../../actions/setFeatureFlagFactoryAction';
import { setOpinionTypesAction } from '../../actions/setOpinionTypesAction';

export const gotoPublicSearchSequence = [
  setCurrentPageAction('Interstitial'),
  clearAlertsAction,
  defaultAdvancedSearchFormAction,
  getPublicJudgesAction,
  setAllAndCurrentJudgesAction,
  getOpinionTypesAction,
  setOpinionTypesAction,
  setCurrentPageAction('PublicSearch'),
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH.key,
  ),
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_OPINION_SEARCH.key,
  ),
];
