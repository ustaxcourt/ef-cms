import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { closeMobileMenuAction } from '../actions/closeMobileMenuAction';
import { defaultAdvancedSearchFormAction } from '../actions/AdvancedSearch/defaultAdvancedSearchFormAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';
import { getOpinionTypesAction } from '../actions/getOpinionTypesAction';
import { getUsersInSectionAction } from '../actions/getUsersInSectionAction';
import { isInternalUserAction } from '../actions/isInternalUserAction';
import { parallel } from 'cerebral';
import { setAlertWarningAction } from '../actions/setAlertWarningAction';
import { setAllAndCurrentJudgesAction } from '../actions/setAllAndCurrentJudgesAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setOpinionTypesAction } from '../actions/setOpinionTypesAction';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

const fetchFeatureFlag = flagName => {
  return [
    getFeatureFlagValueFactoryAction(
      getConstants().ALLOWLIST_FEATURE_FLAGS[flagName],
    ),
    {
      no: [setAlertWarningAction],
      yes: [],
    },
  ];
};

export const gotoAdvancedSearchSequence =
  startWebSocketConnectionSequenceDecorator([
    setCurrentPageAction('Interstitial'),
    clearScreenMetadataAction,
    closeMobileMenuAction,
    defaultAdvancedSearchFormAction,
    parallel([
      [
        getUsersInSectionAction({ section: 'judge' }),
        setAllAndCurrentJudgesAction,
      ],
      [getOpinionTypesAction, setOpinionTypesAction],
      [
        isInternalUserAction,
        {
          no: [
            parallel([
              fetchFeatureFlag('EXTERNAL_ORDER_SEARCH'),
              fetchFeatureFlag('EXTERNAL_OPINION_SEARCH'),
            ]),
          ],
          yes: [
            parallel([
              fetchFeatureFlag('INTERNAL_ORDER_SEARCH'),
              fetchFeatureFlag('INTERNAL_OPINION_SEARCH'),
            ]),
          ],
        },
      ],
    ]),
    setCurrentPageAction('AdvancedSearch'),
  ]);
