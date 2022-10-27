import { state } from 'cerebral';

export const showPractitionerDocumentLinkAction = ({ props, store }) => {
  store.set(
    state.form.showPractitionerDocumentLink,
    props.showPractitionerDocumentLink,
  );
};
