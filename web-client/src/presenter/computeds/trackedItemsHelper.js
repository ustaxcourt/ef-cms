import { state } from 'cerebral';

export const trackedItemsHelper = get => {
  const permissions = get(state.permissions);
  const hasTrackedItemsPermission = permissions.TRACKED_ITEMS;

  return {
    hasTrackedItemsPermission,
  };
};
