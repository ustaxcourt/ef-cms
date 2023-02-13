import { getConstants } from '../../getConstants';
import { getFeatureFlagFactoryAction } from '../actions/getFeatureFlagFactoryAction';
import { setFeatureFlagFactoryAction } from '../actions/setFeatureFlagFactoryAction';

export const setupConfigSequence = [
  getFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.PDFJS_EXPRESS_VIEWER.key,
  ),
  setFeatureFlagFactoryAction(
    getConstants().ALLOWLIST_FEATURE_FLAGS.PDFJS_EXPRESS_VIEWER.key,
  ),
];
