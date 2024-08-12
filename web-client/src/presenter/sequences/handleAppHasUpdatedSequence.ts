import { broadcastAppUpdatedAction } from '@web-client/presenter/actions/broadcastAppUpdatedAction';
import { clearRefreshTokenIntervalAction } from '@web-client/presenter/actions/clearRefreshTokenIntervalAction';
import { openAppUpdatedModalSequence } from '@web-client/presenter/sequences/openAppUpdatedModalSequence';
import { setClientNeedsToRefresh } from '@web-client/presenter/actions/setClientNeedsToRefresh';

export const handleAppHasUpdatedSequence = [
  setClientNeedsToRefresh,
  clearRefreshTokenIntervalAction, // Clear the refresh token interval since all subsequent requests until refresh will fail
  broadcastAppUpdatedAction, // Ensure consistent behavior across tabs
  openAppUpdatedModalSequence,
] as unknown as (props: { skipBroadcast?: boolean }) => void;
