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
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { settlePromises } from '@web-api/utilities/settlePromises';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';

export const updateCourtIssuedDocketEntry = async (
  _applicationContext: ServerApplicationContext,
  { documentMeta }: { documentMeta: any },
  authorizedUser: UnknownAuthUser,
) => {
  const hasPermission =
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY) ||
    isAuthorized(authorizedUser, ROLE_PERMISSIONS.CREATE_ORDER_DOCKET_ENTRY);

  if (!hasPermission) {
    throw new UnauthorizedError('Unauthorized');
  }
  const user = await getUserById({ userId: authorizedUser.userId });
  if (!user) {
    throw new NotFoundError(
      `Unable to find user with userId ${authorizedUser.userId}`,
    );
  }

  const { docketEntryId, docketNumber } = documentMeta;

  const caseToUpdate = await getCaseByDocketNumber({
    docketNumber,
  });

  const caseEntity = new Case(caseToUpdate, { authorizedUser });

  const currentDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!currentDocketEntry) {
    throw new NotFoundError('Document not found');
  }

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
    upsertWorkItems({
      workItems: [rawValidWorkItem],
    }),
    updateCaseAndAssociations({
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
