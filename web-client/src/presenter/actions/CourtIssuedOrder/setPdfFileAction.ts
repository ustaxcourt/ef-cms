import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the state.form.primaryDocumentFile which is used for saving PDF
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.pdfFile
 * @param {object} providers.store the cerebral store used for setting the state.form.primaryDocumentFile
 */
export const setPdfFileAction = ({ props, store }: ActionProps) => {
  store.set(state.form.primaryDocumentFile, props.pdfFile);
};
