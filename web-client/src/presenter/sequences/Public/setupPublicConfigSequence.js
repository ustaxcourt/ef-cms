import { getConstants } from '../../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../../actions/getFeatureFlagValueFactoryAction';

export const setupPublicConfigSequence = [
  getFeatureFlagValueFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.PDFJS_EXPRESS_VIEWER,
    true,
  ),
];
