import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { getWorkItemByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';

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

  const [caseToUpdate, workItem] = await Promise.all([
    getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    }),
    getWorkItemByDocketNumberAndDocketEntryId({
      docketNumber,
      docketEntryId,
    }),
  ]);

  if (!workItem) {
    throw new NotFoundError(
      `Could not find work item associated with ${docketNumber} document ${docketEntryId}`,
    );
  }

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

  const rawValidWorkItem = workItem.validate().toRawObject();

  const saveItems = [
    upsertWorkItems({
      workItems: [rawValidWorkItem],
    }),
    applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    }),
  ];

  await settlePromises(saveItems);

  return caseEntity.toRawObject();
};

export const updateCourtIssuedDocketEntryInteractor = withLocking(
  updateCourtIssuedDocketEntry,
  (_applicationContext: ServerApplicationContext, { documentMeta }) => ({
    identifiers: [`case|${documentMeta.docketNumber}`],
  }),
);
