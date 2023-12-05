import { Case } from '../../entities/cases/Case';
import {
  DOCUMENT_RELATIONSHIPS,
  ORDER_TYPES,
} from '../../entities/EntityConstants';
import { DocketEntry } from '../../entities/DocketEntry';
import { NotFoundError, UnauthorizedError } from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { get } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

/**
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {object} providers.docketEntryIdToEdit the id of the docket entry to update
 * @param {object} providers.documentMetadata the document metadata
 * @returns {Promise<*>} the updated case entity after the document is updated
 */
export const updateCourtIssuedOrder = async (
  applicationContext,
  { docketEntryIdToEdit, documentMetadata },
) => {
  const authorizedUser = applicationContext.getCurrentUser();
  const { docketNumber } = documentMetadata;

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.COURT_ISSUED_DOCUMENT)) {
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

  const caseEntity = new Case(caseToUpdate, { applicationContext });

  const currentDocument = caseEntity.getDocketEntryById({
    docketEntryId: docketEntryIdToEdit,
  });

  if (!currentDocument) {
    throw new NotFoundError('Document not found');
  }

  const orderTypeEventCodes = Object.values(ORDER_TYPES)
    .filter((orderType: any) => orderType.overrideFreeText)
    .map((d: any) => d.eventCode);

  if (orderTypeEventCodes.includes(documentMetadata.eventCode)) {
    documentMetadata.freeText = documentMetadata.documentTitle;
    if (documentMetadata.draftOrderState) {
      documentMetadata.draftOrderState.freeText =
        documentMetadata.documentTitle;
    }
  }

  if (documentMetadata.documentContents) {
    const { documentContentsId } = currentDocument;

    const contentToStore = {
      documentContents: documentMetadata.documentContents,
      richText: documentMetadata.draftOrderState.richText,
    };

    await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
      applicationContext,
      document: Buffer.from(JSON.stringify(contentToStore)),
      key: documentContentsId,
      useTempBucket: false,
    });

    delete documentMetadata.documentContents;
    delete documentMetadata.draftOrderState.documentContents;
    delete documentMetadata.draftOrderState.richText;
    delete documentMetadata.draftOrderState.editorDelta;
  }

  const editableFields = {
    documentTitle: documentMetadata.documentTitle,
    documentType:
      get(documentMetadata, 'draftOrderState.documentType') ||
      documentMetadata.documentType,
    draftOrderState: documentMetadata.draftOrderState,
    eventCode:
      get(documentMetadata, 'draftOrderState.eventCode') ||
      documentMetadata.eventCode,
    freeText: documentMetadata.freeText,
  };

  const numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      docketEntryId: docketEntryIdToEdit,
    });

  const docketEntryEntity = new DocketEntry(
    {
      ...currentDocument,
      ...editableFields,
      docketEntryId: docketEntryIdToEdit,
      filedBy: user.name,
      numberOfPages,
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
    },
    { applicationContext },
  );

  docketEntryEntity.setFiledBy(user);

  docketEntryEntity.setAsProcessingStatusAsCompleted();

  // we always un-sign the order document on updates because the court user will need to sign it again
  docketEntryEntity.unsignDocument();

  caseEntity.updateDocketEntry(docketEntryEntity);

  const result = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  return new Case(result, { applicationContext }).validate().toRawObject();
};

export const updateCourtIssuedOrderInteractor = withLocking(
  updateCourtIssuedOrder,
  (_applicationContext: IApplicationContext, { documentMetadata }) => ({
    identifiers: [`case|${documentMetadata.docketNumber}`],
  }),
);
