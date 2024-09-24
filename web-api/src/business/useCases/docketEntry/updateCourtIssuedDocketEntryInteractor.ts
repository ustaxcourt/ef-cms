import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

export const updateCourtIssuedDocketEntry = async (
  applicationContext: ServerApplicationContext,
  { documentMeta }: { documentMeta: any },
  authorizedUser: UnknownAuthUser,
) => {
  const hasPermission =
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY) ||
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY);

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { docketEntryId, docketNumber } = documentMeta;

  const caseToUpdate = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  const currentDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!currentDocketEntry) {
    throw new NotFoundError('Document not found');
  }

  const user = await applicationContext
    .getPersistenceGateway()
    .getUserById({ applicationContext, userId: authorizedUser.userId });

  const editableFields = {
    attachments: documentMeta.attachments,
    date: documentMeta.date,
    docketNumbers: documentMeta.docketNumbers,
    documentTitle: documentMeta.generatedDocumentTitle,
    documentType: documentMeta.documentType,
    eventCode: documentMeta.eventCode,
    freeText: documentMeta.freeText,
    judge: documentMeta.judge,
    scenario: documentMeta.scenario,
    serviceStamp: documentMeta.serviceStamp,
    trialLocation: documentMeta.trialLocation,
  };

  const docketEntryEntity = new DocketEntry(
    {
      ...currentDocketEntry,
      ...editableFields,
      documentTitle: editableFields.documentTitle,
      editState: JSON.stringify(editableFields),
      isOnDocketRecord: true,
    },
    { authorizedUser },
  );

  docketEntryEntity.setFiledBy(user);

  caseEntity.updateDocketEntry(docketEntryEntity);

  const { workItem } = docketEntryEntity;

  Object.assign(workItem, {
    docketEntry: {
      ...docketEntryEntity.toRawObject(),

      createdAt: docketEntryEntity.createdAt,
    },
  });

  docketEntryEntity.setWorkItem(workItem);

  const rawValidWorkItem = workItem.validate().toRawObject();

  const saveItems = [
    saveWorkItem({
      workItem: rawValidWorkItem,
    }),
    applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    }),
  ];

  await Promise.all(saveItems);

  return caseEntity.toRawObject();
};

export const updateCourtIssuedDocketEntryInteractor = withLocking(
  updateCourtIssuedDocketEntry,
  (_applicationContext: ServerApplicationContext, { documentMeta }) => ({
    identifiers: [`case|${documentMeta.docketNumber}`],
  }),
);
