import { Case } from '@shared/business/entities/cases/Case';
import { Correspondence } from '@shared/business/entities/Correspondence';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';

export const updateCorrespondenceDocumentInteractor = async (
  applicationContext: ServerApplicationContext,
  { documentMetadata }: { documentMetadata: TDocumentMetaData },
  authorizedUser: UnknownAuthUser,
) => {
  const { docketNumber } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.CASE_CORRESPONDENCE)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToUpdate = await getCaseByDocketNumber({
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

  await applicationContext.getPersistenceGateway().updateCaseCorrespondence({
    applicationContext,
    correspondence: updatedCorrespondenceEntity.validate().toRawObject(),
    docketNumber,
  });

  return caseEntityRaw;
};
