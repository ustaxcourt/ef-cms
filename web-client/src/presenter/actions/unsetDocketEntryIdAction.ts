import { state } from '@web-client/presenter/app.cerebral';

/**
 * unset state.docketEntryId
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const unsetDocketEntryIdAction = ({ store }: ActionProps) => {
  store.unset(state.docketEntryId);
};
