import { state } from '@web-client/presenter/app.cerebral';

/**
 * add supporting document to form for either primary or secondary doc
 * depending on props.type passed in
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get function
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store object
 */
export const addSupportingDocumentToFormAction = ({
  get,
  props,
  store,
}: ActionProps) => {
  const { type } = props;

  if (type === 'primary') {
    store.set(state.form.hasSupportingDocuments, true);
    const supportingDocuments = get(state.form.supportingDocuments) || [];
    supportingDocuments.push({
      attachments: false,
      certificateOfService: false,
    });
    store.set(state.form.supportingDocuments, supportingDocuments);
  } else if (type === 'secondary') {
    store.set(state.form.hasSecondarySupportingDocuments, true);
    const secondarySupportingDocuments =
      get(state.form.secondarySupportingDocuments) || [];
    secondarySupportingDocuments.push({
      attachments: false,
      certificateOfService: false,
    });
    store.set(
      state.form.secondarySupportingDocuments,
      secondarySupportingDocuments,
    );
  }
};
