import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
import { getOpinionTypesAction } from '../actions/getOpinionTypesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isInternalUserAction } from '../actions/isInternalUserAction';
import { setAdvancedSearchPropsOnFormAction } from '../actions/AdvancedSearch/setAdvancedSearchPropsOnFormAction';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setOpinionTypesAction } from '../actions/setOpinionTypesAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoAdvancedSearchSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    clearScreenMetadataAction,
    closeMobileMenuAction,
    defaultAdvancedSearchFormAction,
    getUsersInSectionAction({ section: 'judge' }),
    setAllAndCurrentJudgesAction,
    getOpinionTypesAction,
    setOpinionTypesAction,
    setAdvancedSearchPropsOnFormAction,
    setCurrentPageAction('AdvancedSearch'),
    isInternalUserAction,
    {
      no: [
        getFeatureFlagValueFactoryAction(
          getConstants().ALLOWLIST_FEATURE_FLAGS.EXTERNAL_ORDER_SEARCH,
        ),
        {
          no: [setAlertWarningAction],
          yes: [],
        },
      ],
      yes: [
        getFeatureFlagValueFactoryAction(
          getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_ORDER_SEARCH,
        ),
        {
          no: [setAlertWarningAction],
          yes: [],
        },
        getFeatureFlagValueFactoryAction(
          getConstants().ALLOWLIST_FEATURE_FLAGS.INTERNAL_OPINION_SEARCH,
        ),
        {
          no: [setAlertWarningAction],
          yes: [],
        },
      ],
    },
  ]);
