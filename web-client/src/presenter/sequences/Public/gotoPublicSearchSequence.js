import { clearAlertsAction } from '../../actions/clearAlertsAction';
import { defaultAdvancedSearchFormAction } from '../../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
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
];
