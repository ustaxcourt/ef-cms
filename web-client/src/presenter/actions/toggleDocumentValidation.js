import { state } from 'cerebral';

export default ({ props, store, get }) => {
  const { document } = props;
  const indexToReplace = get(state.caseDetail.documents).findIndex(
    d => d.documentId === document.documentId,
  );
  store.merge(state.caseDetail.documents[indexToReplace], {
    validated: !document.validated,
  });
};
