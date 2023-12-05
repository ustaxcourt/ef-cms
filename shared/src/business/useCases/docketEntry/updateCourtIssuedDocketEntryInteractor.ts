import { Case } from '../../entities/cases/Case';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.documentMeta document details to go on the record
 * @returns {object} the updated case after the documents are added
 */
export const updateCourtIssuedDocketEntry = async (
  applicationContext: IApplicationContext,
  { documentMeta }: { documentMeta: any },
) => {
  const authorizedUser = applicationContext.getCurrentUser();

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

  const caseEntity = new Case(caseToUpdate, { applicationContext });

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
    { applicationContext },
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
    applicationContext.getPersistenceGateway().saveWorkItem({
      applicationContext,
      workItem: rawValidWorkItem,
    }),
    applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    }),
  ];

  await Promise.all(saveItems);

  return caseEntity.toRawObject();
};

export const updateCourtIssuedDocketEntryInteractor = withLocking(
  updateCourtIssuedDocketEntry,
  (_applicationContext: IApplicationContext, { documentMeta }) => ({
    identifiers: [`case|${documentMeta.docketNumber}`],
  }),
);
