const DEFAULT = {};

export const featureFlagTableDefinition = {
  name: DEFAULT as string,
  value: DEFAULT as { current: any },
};

export type FeatureFlagTable = typeof featureFlagTableDefinition;

export const DW_FEATURE_FLAG_COLUMNS = Object.keys(
  featureFlagTableDefinition,
) as Array<keyof FeatureFlagTable>;
