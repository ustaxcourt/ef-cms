import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const featureFlagDefinition = {
  name: DEFAULT as string,
  value: DEFAULT as { current: any },
};

export type FeatureFlagTable = typeof featureFlagDefinition;

export const DW_FEATURE_FLAG_COLUMNS = Object.keys(
  featureFlagDefinition,
) as Array<keyof FeatureFlagTable>;

export type FeatureFlagTableKysely = Selectable<FeatureFlagTable>;
export type NewFeatureFlagTableKysely = Insertable<FeatureFlagTable>;
export type UpdateFeatureFlagTableKysely = Updateable<FeatureFlagTable>;
