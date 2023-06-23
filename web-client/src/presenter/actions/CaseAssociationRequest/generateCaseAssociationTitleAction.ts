import { isEmpty } from 'lodash';
import { state } from '@web-client/presenter/app.cerebral';

export const generateCaseAssociationTitleAction = ({
  applicationContext,
  get,
  store,
}: ActionProps) => {
  const caseAssociationRequest = get(state.form);
  const { petitioners } = get(state.caseDetail);

  let documentTitle = applicationContext
    .getUseCases()
    .generateCaseAssociationDocumentTitleInteractor({
      caseAssociationRequest,
      petitioners,
    });

  store.set(state.form.documentTitle, documentTitle);

  if (!isEmpty(caseAssociationRequest.supportingDocumentMetadata)) {
    caseAssociationRequest.supportingDocumentMetadata.previousDocument = {
      documentTitle,
      documentType: caseAssociationRequest.documentType,
    };
    documentTitle = applicationContext
      .getUtilities()
      .generateExternalDocumentTitle(applicationContext, {
        documentMetadata: caseAssociationRequest.supportingDocumentMetadata,
      });
    store.set(
      state.form.supportingDocumentMetadata.documentTitle,
      documentTitle,
    );
  }
};
