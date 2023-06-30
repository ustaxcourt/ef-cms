import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets default tab for the edit docket entry meta screen
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store
 */
export const setDefaultEditDocketEntryMetaTabAction = ({
  store,
}: ActionProps) => {
  store.set(state.editDocketEntryMetaTab, 'documentInfo');
};
