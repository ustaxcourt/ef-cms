import { getConstants } from '../../getConstants';
import { getFeatureFlagValueFactoryAction } from '../actions/getFeatureFlagValueFactoryAction';

export const setupConfigSequence = [
  getFeatureFlagValueFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.PDFJS_EXPRESS_VIEWER,
    true,
  ),
];
