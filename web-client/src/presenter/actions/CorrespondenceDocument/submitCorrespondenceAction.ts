import { omit } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets the correspondence document onto the case
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {Function} providers.get the cerebral get helper function
 * @returns {Promise} async action
 */
export const submitCorrespondenceAction = async ({
  applicationContext,
  get,
  props,
}: ActionProps) => {
  let caseDetail;
  const docketNumber = get(state.caseDetail.docketNumber);
  const { primaryDocumentFileId: correspondenceId } = props;
  const formData = get(state.form);

  const { documentIdToEdit } = formData;

  let documentMetadata = omit(formData, [
    'primaryDocumentFile',
    'documentIdToEdit',
  ]);

  documentMetadata = {
    ...documentMetadata,
    docketNumber,
  };

  await applicationContext
    .getUseCases()
    .validatePdfInteractor(applicationContext, {
      key: correspondenceId,
    });

  if (documentIdToEdit) {
    caseDetail = await applicationContext
      .getUseCases()
      .updateCorrespondenceDocumentInteractor(applicationContext, {
        correspondenceId: documentIdToEdit,
        documentMetadata,
      });
  } else {
    caseDetail = await applicationContext
      .getUseCases()
      .fileCorrespondenceDocumentInteractor(applicationContext, {
        documentMetadata,
        primaryDocumentFileId: correspondenceId,
      });
  }

  return {
    caseDetail,
    correspondenceId,
    docketNumber,
  };
};
