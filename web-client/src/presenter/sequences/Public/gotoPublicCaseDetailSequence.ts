import { getConstants } from '../../../getConstants';
import { getFeatureFlagFactoryAction } from '../../actions/getFeatureFlagFactoryAction';
import { getPublicCaseAction } from '../../actions/Public/getPublicCaseAction';
import { setCaseAction } from '../../actions/setCaseAction';
import { setCurrentPageAction } from '../../actions/setCurrentPageAction';
import { setFeatureFlagFactoryAction } from '../../actions/setFeatureFlagFactoryAction';

export const gotoPublicCaseDetailSequence = [
  getPublicCaseAction,
  setCaseAction,
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS
      .DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS
      .DOCUMENT_VISIBILITY_POLICY_CHANGE_DATE.key,
  ),
  setCurrentPageAction('PublicCaseDetail'),
];
