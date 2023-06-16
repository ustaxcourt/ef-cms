import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.docketEntryId based on the props.docketEntryId passed in
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting the state.docketEntryId
 * @param {object} providers.props the cerebral props object used for passing the props.docketEntryId
 */
export const setDocketEntryIdAction = ({ props, store }: ActionProps) => {
  store.set(state.docketEntryId, props.docketEntryId);
};
