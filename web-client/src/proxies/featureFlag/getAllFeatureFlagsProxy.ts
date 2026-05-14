import { get } from '../requests';
import { AllFeatureFlags } from '@web-api/business/useCases/featureFlag/getAllFeatureFlagsInteractor';

export const getAllFeatureFlagsInteractor = (applicationContext): Promise<AllFeatureFlags> => {
  return get({
    applicationContext,
    endpoint: '/system/feature-flag/',
    params: {},
  });
};
