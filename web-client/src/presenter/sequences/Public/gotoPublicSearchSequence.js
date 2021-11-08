import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { defaultAdvancedSearchFormAction } from '../../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getConstants } from '../../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../../actions/getFeatureFlagValueFactoryAction';
import { getOpinionTypesAction } from '../../actions/getOpinionTypesAction';
import { getPublicJudgesAction } from '../../actions/Public/getPublicJudgesAction';
import { setAllAndCurrentJudgesAction } from '../../actions/setAllAndCurrentJudgesAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
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
  getFeatureFlagValueFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH,
  ),
  {
    no: [],
    yes: [],
  },
];
