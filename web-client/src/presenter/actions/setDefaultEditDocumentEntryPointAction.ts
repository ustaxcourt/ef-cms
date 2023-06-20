import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets default editDocumentEntryPoint
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store used for setting state.editDocumentEntryPoint
 */
export const setDefaultEditDocumentEntryPointAction = ({
  store,
}: ActionProps) => {
  store.set(state.editDocumentEntryPoint, 'CaseDetail');
};
