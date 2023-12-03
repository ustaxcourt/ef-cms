import { Case } from '../../entities/cases/Case';
import { Correspondence } from '../../entities/Correspondence';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';

/**
 * updateCorrespondenceDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @returns {Promise<*>} the updated case entity after the correspondence document is updated
 */
export const updateCorrespondenceDocumentInteractor = async (
  applicationContext: IApplicationContext,
  { documentMetadata }: { documentMetadata: TDocumentMetaData },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { docketNumber } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentCorrespondenceDocument = caseEntity.getCorrespondenceById({
    correspondenceId: documentMetadata.correspondenceId,
  });

  const updatedCorrespondenceEntity = new Correspondence({
    ...currentCorrespondenceDocument,
    documentTitle: documentMetadata.documentTitle,
  });

  caseEntity.updateCorrespondence(updatedCorrespondenceEntity);

  const caseEntityRaw = caseEntity.validate().toRawObject();

  await applicationContext.getPersistenceGateway().updateCaseCorrespondence({
    applicationContext,
    correspondence: updatedCorrespondenceEntity.validate().toRawObject(),
    docketNumber,
  });

  return caseEntityRaw;
};
