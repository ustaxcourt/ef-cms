import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { Correspondence } from '../../../../../shared/src/business/entities/Correspondence';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { updateCaseCorrespondence } from '@web-api/persistence/postgres/correspondence/updateCaseCorrespondence';

export const updateCorrespondenceDocumentInteractor = async (
  applicationContext: ServerApplicationContext,
  { documentMetadata }: { documentMetadata: TDocumentMetaData },
  authorizedUser: UnknownAuthUser,
) => {
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

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  const currentCorrespondenceDocument = caseEntity.getCorrespondenceById({
    correspondenceId: documentMetadata.correspondenceId,
  });

  const updatedCorrespondenceEntity = new Correspondence({
    ...currentCorrespondenceDocument,
    documentTitle: documentMetadata.documentTitle,
  });

  caseEntity.updateCorrespondence(updatedCorrespondenceEntity);

  const caseEntityRaw = caseEntity.validate().toRawObject();

  await updateCaseCorrespondence({
    correspondence: updatedCorrespondenceEntity.validate().toRawObject(),
    docketNumber,
  });

  return caseEntityRaw;
};
