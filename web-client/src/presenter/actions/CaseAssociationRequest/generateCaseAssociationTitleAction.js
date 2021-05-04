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
  const contactPrimaryName = applicationContext
    .getUtilities()
    .getContactPrimary(get(state.caseDetail)).name;
  const contactSecondaryName = applicationContext
    .getUtilities()
    .getContactSecondary(get(state.caseDetail))?.name;

  let documentTitle = applicationContext
    .getUseCases()
    .generateCaseAssociationDocumentTitleInteractor({
      applicationContext,
      caseAssociationRequest,
      contactPrimaryName,
      contactSecondaryName,
    });
  store.set(state.form.documentTitle, documentTitle);

  if (!isEmpty(caseAssociationRequest.supportingDocumentMetadata)) {
    caseAssociationRequest.supportingDocumentMetadata.previousDocument = {
      documentTitle,
      documentType: caseAssociationRequest.documentType,
    };
    documentTitle = applicationContext
      .getUseCases()
      .generateDocumentTitleInteractor({
        applicationContext,
        documentMetadata: caseAssociationRequest.supportingDocumentMetadata,
      });
    store.set(
      state.form.supportingDocumentMetadata.documentTitle,
      documentTitle,
    );
  }
};
