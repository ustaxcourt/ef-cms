import { state } from 'cerebral';

export default ({ props, store, get }) => {
  const { item } = props;
  const indexToReplace = get(state.caseDetail.documents).findIndex(
    d => d.documentId === item.documentId,
  );
  store.merge(state.caseDetail.documents[indexToReplace], {
    validated: !item.validated,
  });
};
