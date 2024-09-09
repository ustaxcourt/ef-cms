import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { Correspondence } from '../../../../../shared/src/business/entities/Correspondence';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';

/**
 * fileCorrespondenceDocumentInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMetadata the document metadata
 * @param {string} providers.primaryDocumentFileId the id of the primary document
 * @returns {Promise<*>} the raw case object
 */
export const fileCorrespondenceDocumentInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    documentMetadata,
    primaryDocumentFileId,
  }: { documentMetadata: TDocumentMetaData; primaryDocumentFileId: string },
  authorizedUser: UnknownAuthUser,
) => {
  const { docketNumber } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  if (!caseToUpdate) {
    throw new NotFoundError(`Case ${docketNumber} was not found`);
  }

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  const correspondenceEntity = new Correspondence({
    ...documentMetadata,
    correspondenceId: primaryDocumentFileId,
    filedBy: user.name,
    userId: user.userId,
  });

  caseEntity.fileCorrespondence(correspondenceEntity);

  if (caseEntity.validate()) {
    await applicationContext.getPersistenceGateway().updateCaseCorrespondence({
      applicationContext,
      correspondence: correspondenceEntity.validate().toRawObject(),
      docketNumber,
    });
  }

  return caseEntity.toRawObject();
};
