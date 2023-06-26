import { state } from '@web-client/presenter/app.cerebral';

/**
 * used by the formattedMessage helper to cache the messages due to performance issues with
 * some users having lots of messages.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.store the cerebral store
 * @returns {undefined}
 */
export const resetCacheKeyAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  store.set(state.messageCacheKey, applicationContext.getUniqueId());
};
