import { Selectable, Insertable, Updateable } from 'kysely';

const DEFAULT = {};

export const featureFlagTableDefinition = {
  name: DEFAULT as string,
  value: DEFAULT as { current: any },
};

export type FeatureFlagTable = typeof featureFlagTableDefinition;

export const DW_FEATURE_FLAG_COLUMNS = Object.keys(
  featureFlagTableDefinition,
) as Array<keyof FeatureFlagTable>;

export type FeatureFlagKysely = Selectable<FeatureFlagTable>;
export type NewFeatureFlagKysely = Insertable<FeatureFlagTable>;
export type UpdateFeatureFlagKysely = Updateable<FeatureFlagTable>;