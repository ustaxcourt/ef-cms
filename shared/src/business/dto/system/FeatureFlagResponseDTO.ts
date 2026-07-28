import { ALLOWLIST_FEATURE_FLAGS } from '@shared/business/entities/EntityConstants';

type AllowedFeatureFlagKeys =
  (typeof ALLOWLIST_FEATURE_FLAGS)[keyof typeof ALLOWLIST_FEATURE_FLAGS]['key'];

export class FeatureFlagResponseDTO {
  entityName: 'FeatureFlagResponseDTO' = 'FeatureFlagResponseDTO';

  constructor(data: Partial<Record<AllowedFeatureFlagKeys, any>> = {}) {
    Object.assign(this, data);
    this.entityName = 'FeatureFlagResponseDTO';
  }
}
