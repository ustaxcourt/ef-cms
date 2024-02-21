import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * Uploads external documents and calls the interactor to associate them with one or more cases
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {Array} providers.documentFiles array of file objects
 * @param {object} providers.documentMetadata metadata associated with the documents/cases
 * @param {string} providers.progressTrackerCbs callback functions for updating the progress indicator during file upload
 * @returns {Promise<Object>} the case details with the uploaded document(s) attached
 */
export const uploadExternalDocumentsInteractor = async (
  applicationContext: any,
  {
    documentFiles,
    documentMetadata,
    progressTrackerCbs,
  }: {
    documentFiles: Record<string, any>;
    documentMetadata: any;
    progressTrackerCbs: Record<string, any>;
  },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const docketEntryIdsAdded = [];

  documentMetadata.primaryDocumentId = await applicationContext
    .getUseCases()
    .uploadDocumentAndMakeSafeInteractor(applicationContext, {
      document: progressTrackerCbs.primary.file,
      onUploadProgress: progressTrackerCbs.primary.uploadProgress,
    });
  docketEntryIdsAdded.push(documentMetadata.primaryDocumentId);

  if (documentFiles.secondary) {
    documentMetadata.secondaryDocument.docketEntryId = await applicationContext
      .getUseCases()
      .uploadDocumentAndMakeSafeInteractor(applicationContext, {
        document: progressTrackerCbs.secondary.file,
        onUploadProgress: progressTrackerCbs.secondary.uploadProgress,
      });
    docketEntryIdsAdded.push(documentMetadata.secondaryDocument.docketEntryId);
  }

  if (documentMetadata.hasSupportingDocuments) {
    for (let i = 0; i < documentMetadata.supportingDocuments.length; i++) {
      documentMetadata.supportingDocuments[i].docketEntryId =
        await applicationContext
          .getUseCases()
          .uploadDocumentAndMakeSafeInteractor(applicationContext, {
            document: progressTrackerCbs[`primarySupporting${i}`].file,
            onUploadProgress:
              progressTrackerCbs[`primarySupporting${i}`].uploadProgress,
          });
      docketEntryIdsAdded.push(
        documentMetadata.supportingDocuments[i].docketEntryId,
      );
    }
  }

  if (documentMetadata.hasSecondarySupportingDocuments) {
    for (
      let i = 0;
      i < documentMetadata.secondarySupportingDocuments.length;
      i++
    ) {
      documentMetadata.secondarySupportingDocuments[i].docketEntryId =
        await applicationContext
          .getUseCases()
          .uploadDocumentAndMakeSafeInteractor(applicationContext, {
            document: progressTrackerCbs[`secondarySupporting${i}`].file,
            onUploadProgress:
              progressTrackerCbs[`secondarySupporting${i}`].uploadProgress,
          });
      docketEntryIdsAdded.push(
        documentMetadata.secondarySupportingDocuments[i].docketEntryId,
      );
    }
  }

  return {
    caseDetail: await applicationContext
      .getUseCases()
      .fileExternalDocumentInteractor(applicationContext, {
        documentMetadata,
      }),
    docketEntryIdsAdded,
  };
};
