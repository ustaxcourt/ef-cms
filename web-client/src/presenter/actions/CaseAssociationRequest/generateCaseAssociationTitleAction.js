import { isEmpty } from 'lodash';
import { state } from 'cerebral';

/**
 * Set document title.
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 */
export const generateCaseAssociationTitleAction = ({
  applicationContext,
  get,
  store,
}) => {
  const caseAssociationRequest = get(state.form);
  const contactPrimaryName = get(state.caseDetail.contactPrimary.name);
  const contactSecondaryName = get(state.caseDetail.contactSecondary.name);

  let documentTitle = applicationContext
    .getUseCases()
    .generateCaseAssociationDocumentTitle({
      applicationContext,
      caseAssociationRequest,
      contactPrimaryName,
      contactSecondaryName,
    });
  store.set(state.form.documentTitle, documentTitle);

  if (!isEmpty(caseAssociationRequest.supportingDocumentMetadata)) {
    caseAssociationRequest.supportingDocumentMetadata.previousDocument = documentTitle;
    documentTitle = applicationContext.getUseCases().generateDocumentTitle({
      applicationContext,
      documentMetadata: caseAssociationRequest.supportingDocumentMetadata,
    });
    store.set(
      state.form.supportingDocumentMetadata.documentTitle,
      documentTitle,
    );
  }
};
