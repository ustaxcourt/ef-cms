import { getCaseAction } from '../actions/getCaseAction';
import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseOnFormAction } from '../actions/setCaseOnFormAction';
import { setCaseOnFormUsingStateAction } from '../actions/setCaseOnFormUsingStateAction';
import { setContactsOnFormAction } from '../actions/setContactsOnFormAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';
import { shouldLoadCaseAction } from '../actions/shouldLoadCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { startWebSocketConnectionSequenceDecorator } from '../utilities/startWebSocketConnectionSequenceDecorator';

export const gotoReviewSavedPetitionSequence =
  startWebSocketConnectionSequenceDecorator([
    shouldLoadCaseAction,
    {
      ignore: [setCaseOnFormUsingStateAction],
      load: showProgressSequenceDecorator([
        getCaseAction,
        setCaseAction,
        setCaseOnFormAction,
      ]),
    },
    getFeatureFlagFactoryAction(
      getConstants().ALLOWLIST_FEATURE_FLAGS
        .E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key,
    ),
    setFeatureFlagFactoryAction(
      getConstants().ALLOWLIST_FEATURE_FLAGS
        .E_CONSENT_FIELDS_ENABLED_FEATURE_FLAG.key,
    ),
    setContactsOnFormAction,
    setCurrentPageAction('ReviewSavedPetition'),
  ]);
