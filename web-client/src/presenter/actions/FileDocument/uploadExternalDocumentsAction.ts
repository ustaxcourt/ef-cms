import { setupPercentDone } from '../createCaseFromPaperAction';
import { state } from 'cerebral';

const addCoversheet = ({ applicationContext, docketEntryId, docketNumber }) => {
  return applicationContext
    .getUseCases()
    .addCoversheetInteractor(applicationContext, {
      docketEntryId,
      docketNumber,
    });
};

const removeSealedCases = consolidatedCases => {
  const filteredConsolidatedCases: any = [];
  consolidatedCases.forEach(consolidatedCase => {
    if (!consolidatedCase.isSealed) {
      filteredConsolidatedCases.push(consolidatedCase);
    } else if (consolidatedCase.irsPractitioners?.length > 0) {
      filteredConsolidatedCases.push(consolidatedCase);
    }
  });
  return filteredConsolidatedCases;
};

/**
 * upload document to s3.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @param {Function} providers.store the cerebral store function
 * @returns {object} the next path based on if validation was successful or error
 */
export const uploadExternalDocumentsAction = async ({
  applicationContext,
  get,
  path,
  store,
}) => {
  const { PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP } =
    applicationContext.getConstants();

  const { consolidatedCases, docketNumber } = get(state.caseDetail);
  const form = get(state.form);

  let privatePractitioners: any = null;
  let { filers } = form;
  if (
    PRACTITIONER_ASSOCIATION_DOCUMENT_TYPES_MAP.filter(
      d => d.filedByPractitioner,
    )
      .map(item => item.eventCode)
      .includes(form.eventCode)
  ) {
    privatePractitioners = form.practitioner;
  }

  const consolidatedCasesToFileAcross = form.fileAcrossConsolidatedGroup
    ? removeSealedCases(consolidatedCases)
    : undefined;

  console.log('consolidatedCasesToFileAcross', consolidatedCasesToFileAcross);

  const documentMetadata: any = {
    ...form,
    consolidatedCasesToFileAcross,
    docketNumber,
    filers,
    isFileAttached: true,
    privatePractitioners,
  };

  const documentFiles: any = {
    primary: form.primaryDocumentFile,
  };

  if (form.secondaryDocumentFile) {
    documentFiles.secondary = form.secondaryDocumentFile;
    documentMetadata.secondaryDocument.isFileAttached = true;
  }

  if (form.hasSupportingDocuments) {
    form.supportingDocuments.forEach((item, idx) => {
      documentFiles[`primarySupporting${idx}`] = item.supportingDocumentFile;
      item.isFileAttached = !!item.supportingDocumentFile;
    });
  }

  if (form.hasSecondarySupportingDocuments) {
    form.secondarySupportingDocuments.forEach((item, idx) => {
      documentFiles[`secondarySupporting${idx}`] = item.supportingDocumentFile;
      item.isFileAttached = !!item.supportingDocumentFile;
    });
  }

  try {
    const progressFunctions = setupPercentDone(documentFiles, store);

    const { caseDetail, docketEntryIdsAdded } = await applicationContext
      .getUseCases()
      .uploadExternalDocumentsInteractor(applicationContext, {
        documentFiles,
        documentMetadata,
        progressFunctions,
      });

    for (let docketEntryId of docketEntryIdsAdded) {
      await addCoversheet({
        applicationContext,
        docketEntryId,
        docketNumber: form.fileAcrossConsolidatedGroup
          ? caseDetail.leadDocketNumber
          : docketNumber,
      });
    }

    return path.success({
      caseDetail,
      docketNumber,
      documentsFiled: documentMetadata,
      fileAcrossConsolidatedGroup: form.fileAcrossConsolidatedGroup,
    });
  } catch (err) {
    return path.error();
  }
};
