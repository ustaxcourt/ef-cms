import {
  CONTACT_CHANGE_DOCUMENT_TYPES,
  DOCUMENT_PROCESSING_STATUS_OPTIONS,
  DOCUMENT_RELATIONSHIPS,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import {
  FORMATS,
  dateStringsCompared,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import {
  InvalidRequest,
  NotFoundError,
  UnauthorizedError,
} from '@web-api/errors/errors';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '@shared/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { User } from '@shared/business/entities/User';
import { addServedStampToDocument } from '@web-api/business/useCases/courtIssuedDocument/addServedStampToDocument';
import { aggregatePartiesForService } from '@shared/business/utilities/aggregatePartiesForService';
import { generateNoticeOfDocketChangePdf } from '@web-api/business/useCaseHelper/noticeOfDocketChange/generateNoticeOfDocketChangePdf';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCaseCaptionMeta } from '@shared/business/utilities/getCaseCaptionMeta';
import { getDocumentTitleForNoticeOfChange } from '@shared/business/utilities/getDocumentTitleForNoticeOfChange';
import { replaceBracketed } from '@shared/business/utilities/replaceBracketed';
import { upsertWorkItems } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getFeatureFlagValues } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { getWorkItemByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';
import { getDocketEntriesByDocketNumberAndDocketEntryId } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { updateCaseAndAssociations } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { withLocking } from '@web-api/persistence/postgres/utils/mutex';
import { WorkItem } from '@shared/business/entities/WorkItem';

const completeDocketEntryQC = async (
  applicationContext: ServerApplicationContext,
  { entryMetadata }: { entryMetadata: any },
  authorizedUser: UnknownAuthUser,
) => {
  const { PDFDocument } = await applicationContext.getPdfLib();

  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.DOCKET_ENTRY)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const {
    docketEntryId,
    docketNumber,
    overridePaperServiceAddress,
    selectedSection,
  } = entryMetadata;

  const user = await getUserById({ userId: authorizedUser.userId });

  if (!user) {
    throw new NotFoundError(
      `User not found with user id ${authorizedUser.userId}`,
    );
  }

  const [caseToUpdate, workItem] = await Promise.all([
    getCaseByDocketNumber({
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

  let caseEntity = new Case(caseToUpdate, { authorizedUser });
  const currentDocketEntry = caseEntity.getDocketEntryById({
    docketEntryId,
  });

  if (!currentDocketEntry) {
    throw new NotFoundError(
      `Could not find docket entry with id ${docketEntryId} on case ${docketNumber}`,
    );
  }

  const { index: docketRecordIndexUpdated } = currentDocketEntry;

  if (workItem.isCompleted()) {
    throw new InvalidRequest('The work item was already completed');
  }

  const editableFields = {
    addToCoversheet: entryMetadata.addToCoversheet,
    additionalInfo: entryMetadata.additionalInfo,
    additionalInfo2: entryMetadata.additionalInfo2,
    attachments: entryMetadata.attachments,
    certificateOfService: entryMetadata.certificateOfService,
    certificateOfServiceDate: entryMetadata.certificateOfServiceDate,
    documentTitle: entryMetadata.documentTitle,
    documentType: entryMetadata.documentType,
    eventCode: entryMetadata.eventCode,
    filedBy: entryMetadata.filedBy,
    filers: entryMetadata.filers,
    freeText: entryMetadata.freeText,
    hasOtherFilingParty: entryMetadata.hasOtherFilingParty,
    isFileAttached: true,
    lodged: entryMetadata.lodged,
    mailingDate: entryMetadata.mailingDate,
    objections: entryMetadata.objections,
    ordinalValue: entryMetadata.ordinalValue,
    otherFilingParty: entryMetadata.otherFilingParty,
    otherIteration: entryMetadata.otherIteration,
    partyIrsPractitioner: entryMetadata.partyIrsPractitioner,
    pending: entryMetadata.pending,
    previousDocument: entryMetadata.previousDocument,
    receivedAt: entryMetadata.receivedAt,
    scenario: entryMetadata.scenario,
    secondaryDocument: entryMetadata.secondaryDocument,
    serviceDate: entryMetadata.serviceDate,
  };

  const updatedDocketEntry = new DocketEntry(
    {
      ...currentDocketEntry,
      ...editableFields,
      documentTitle: editableFields.documentTitle,
      editState: '{}',
      relationship: DOCUMENT_RELATIONSHIPS.PRIMARY,
    },
    { authorizedUser, petitioners: caseToUpdate.petitioners },
  ).validate();

  const updatedDocumentTitle = getDocumentTitleForNoticeOfChange({
    applicationContext,
    docketEntry: updatedDocketEntry,
  });

  const currentDocumentTitle = getDocumentTitleForNoticeOfChange({
    applicationContext,
    docketEntry: currentDocketEntry,
  });

  const isNewCoverSheetNeeded = needsNewCoversheet({
    applicationContext,
    currentDocketEntry,
    updatedDocketEntry,
  });

  // Determine whether this docket entry is multidocketed across consolidated cases
  const consolidatedDocketNumbers = (caseEntity.consolidatedCases || [])
    .map(c => c.docketNumber)
    .filter(Boolean);

  const docketNumbersToCheck = Array.from(
    new Set([caseEntity.docketNumber, ...consolidatedDocketNumbers]),
  );

  const docketEntriesAcrossCases =
    docketNumbersToCheck && docketNumbersToCheck.length > 0
      ? await getDocketEntriesByDocketNumberAndDocketEntryId({
          docketNumbersAndIds: docketNumbersToCheck.map(dn => ({
            docketNumber: dn,
            docketEntryId,
          })),
        })
      : [];

  const isMultiDocketed = (docketEntriesAcrossCases || []).length > 1;

  if (
    isMultiDocketed &&
    caseEntity.leadDocketNumber &&
    caseEntity.leadDocketNumber !== caseEntity.docketNumber
  ) {
    throw new InvalidRequest(
      'QC for multidocketed documents must be completed on the lead case',
    );
  }

  const needsNoticeOfDocketChange =
    updatedDocketEntry.filedBy !== currentDocketEntry.filedBy ||
    updatedDocumentTitle !== currentDocumentTitle;

  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const { CLERK_OF_THE_COURT_CONFIGURATION } =
    applicationContext.getConstants();

  const [CLERK_OF_THE_COURT_RECORD] = await getFeatureFlagValues([
    CLERK_OF_THE_COURT_CONFIGURATION,
  ]);

  const { name, title } = CLERK_OF_THE_COURT_RECORD.value.current as {
    name: string;
    title: string;
  };

  const docketChangeInfo = {
    caseCaptionExtension,
    caseTitle,
    docketEntryIndex: docketRecordIndexUpdated,
    docketNumber: Case.getDocketNumberWithSuffix({
      docketNumber: caseToUpdate.docketNumber,
      docketNumberSuffix: caseToUpdate.docketNumberSuffix,
    }),
    filingParties: {
      after: updatedDocketEntry.filedBy,
      before: currentDocketEntry.filedBy,
    },
    filingsAndProceedings: {
      after: updatedDocumentTitle,
      before: currentDocumentTitle,
    },
    nameOfClerk: name,
    titleOfClerk: title,
  };

  caseEntity.updateDocketEntry(updatedDocketEntry);

  caseEntity = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAutomaticBlock({ caseEntity });

  workItem.setAsCompleted({
    message: 'completed',
    user,
  });

  const userIsCaseServices = User.isCaseServicesUser({
    section: user.section || '',
  });

  const sectionToAssignTo =
    userIsCaseServices && selectedSection ? selectedSection : user.section;

  workItem.assignToUser({
    assigneeId: user.userId,
    assigneeName: user.name,
    section: WorkItem.getWorkItemSectionFromUserSection({
      section: sectionToAssignTo,
      documentTitle: updatedDocketEntry.documentTitle,
    }),
    sentBy: user.name,
    sentBySection: user.section,
    sentByUserId: user.userId,
  });

  await upsertWorkItems({
    workItems: [workItem.validate().toRawObject()],
  });

  // If multi-docketed and we're the lead case, propagate QC completion to member cases
  if (
    isMultiDocketed &&
    caseEntity.leadDocketNumber === caseEntity.docketNumber
  ) {
    const memberWorkItemsToUpsert: any[] = [];

    for (const de of docketEntriesAcrossCases) {
      if (de.docketNumber === caseEntity.docketNumber) continue; // skip lead

      try {
        const memberCaseRaw = await getCaseByDocketNumber({
          docketNumber: de.docketNumber,
        });

        if (!memberCaseRaw) continue;

        const memberCaseEntity = new Case(memberCaseRaw, { authorizedUser });
        const memberDocketEntry = memberCaseEntity.getDocketEntryById({
          docketEntryId,
        });

        if (!memberDocketEntry) continue;

        // mark member docket entry as QC complete and processing complete
        memberDocketEntry.qcComplete = true;
        memberDocketEntry.processingStatus =
          DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE;

        memberCaseEntity.updateDocketEntry(memberDocketEntry);

        // attempt to complete any work item associated with the member case's docket entry
        const memberWorkItem = await getWorkItemByDocketNumberAndDocketEntryId({
          docketNumber: memberCaseEntity.docketNumber,
          docketEntryId,
        });

        if (memberWorkItem && !memberWorkItem.isCompleted()) {
          memberWorkItem.setAsCompleted({ message: 'completed', user });
          memberWorkItem.assignToUser({
            assigneeId: user.userId,
            assigneeName: user.name,
            section: WorkItem.getWorkItemSectionFromUserSection({
              section: user.section || '',
              documentTitle: memberDocketEntry.documentTitle,
            }),
            sentBy: user.name,
            sentBySection: user.section,
            sentByUserId: user.userId,
          });

          memberWorkItemsToUpsert.push(memberWorkItem.validate().toRawObject());
        }

        // persist member case changes
        await updateCaseAndAssociations({
          authorizedUser,
          caseToUpdate: memberCaseEntity,
        });
      } catch (err) {
        // don't fail the whole flow if a member case update fails; continue to next
        // but log error if logging helper exists
        applicationContext.logger?.error(
          `Failed to update member case for docketEntryId ${docketEntryId} on case ${de.docketNumber}: ${err}`,
        );
      }
    }

    if (memberWorkItemsToUpsert.length > 0) {
      await upsertWorkItems({ workItems: memberWorkItemsToUpsert });
    }
  }

  const servedParties = aggregatePartiesForService(caseEntity);
  let paperServicePdfUrl;
  let paperServiceDocumentTitle;
  let paperServiceParties = servedParties.paper;

  if (
    overridePaperServiceAddress ||
    CONTACT_CHANGE_DOCUMENT_TYPES.includes(updatedDocketEntry.documentType!)
  ) {
    if (servedParties.paper.length > 0) {
      const pdfData = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          key: updatedDocketEntry.docketEntryId,
        });

      const noticeDoc = await PDFDocument.load(pdfData);

      const newPdfDoc = await PDFDocument.create();

      await applicationContext
        .getUseCaseHelpers()
        .appendPaperServiceAddressPageToPdf({
          applicationContext,
          caseEntity,
          newPdfDoc,
          noticeDoc,
          servedParties,
        });

      const paperServicePdfData = await newPdfDoc.save();

      const paperServicePdfId = applicationContext.getUniqueId();

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        document: paperServicePdfData,
        key: paperServicePdfId,
        useTempBucket: true,
      });

      const { url } = await applicationContext
        .getPersistenceGateway()
        .getDownloadPolicyUrl({
          applicationContext,
          key: paperServicePdfId,
          useTempBucket: true,
        });

      paperServicePdfUrl = url;
      paperServiceDocumentTitle = updatedDocketEntry.documentTitle;
    }
  } else if (needsNoticeOfDocketChange) {
    const paperServiceResults: any[] = [];

    // If multi-docketed, generate a notice for each case that contains the docketEntryId
    if (isMultiDocketed) {
      for (const de of docketEntriesAcrossCases) {
        try {
          const memberCaseRaw = await getCaseByDocketNumber({
            docketNumber: de.docketNumber,
          });

          if (!memberCaseRaw) continue;

          const memberCaseEntity =
            memberCaseRaw.docketNumber === caseEntity.docketNumber
              ? caseEntity
              : new Case(memberCaseRaw, { authorizedUser });

          const memberDocketEntry = memberCaseEntity.getDocketEntryById({
            docketEntryId,
          });

          if (!memberDocketEntry) continue;

          const { index: memberDocketEntryIndex } = memberDocketEntry;

          const {
            caseCaptionExtension: memberCaseCaptionExtension,
            caseTitle: memberCaseTitle,
          } = getCaseCaptionMeta(memberCaseEntity);

          const memberDocketChangeInfo = {
            caseCaptionExtension: memberCaseCaptionExtension,
            caseTitle: memberCaseTitle,
            docketEntryIndex: memberDocketEntryIndex,
            docketNumber: Case.getDocketNumberWithSuffix({
              docketNumber: memberCaseRaw.docketNumber,
              docketNumberSuffix: memberCaseRaw.docketNumberSuffix,
            }),
            filingParties: {
              after: updatedDocketEntry.filedBy,
              before: currentDocketEntry.filedBy,
            },
            filingsAndProceedings: {
              after: getDocumentTitleForNoticeOfChange({
                applicationContext,
                docketEntry: updatedDocketEntry,
              }),
              before: getDocumentTitleForNoticeOfChange({
                applicationContext,
                docketEntry: currentDocketEntry,
              }),
            },
            nameOfClerk: name,
            titleOfClerk: title,
          };

          const noticeDocketEntryId = await generateNoticeOfDocketChangePdf({
            applicationContext,
            authorizedUser,
            // @ts-ignore
            docketChangeInfo: memberDocketChangeInfo,
          });

          const memberNoticeUpdatedDocketEntry = new DocketEntry(
            {
              ...SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange,
              docketEntryId: noticeDocketEntryId,
              documentTitle: replaceBracketed(
                SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange
                  .documentTitle,
                // @ts-ignore
                memberDocketChangeInfo.docketEntryIndex,
              ),
              isFileAttached: true,
              isOnDocketRecord: true,
              processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
            },
            { authorizedUser, petitioners: memberCaseRaw.petitioners },
          );

          memberNoticeUpdatedDocketEntry.setFiledBy(user);

          memberNoticeUpdatedDocketEntry.numberOfPages =
            await applicationContext.getUseCaseHelpers().countPagesInDocument({
              applicationContext,
              docketEntryId: memberNoticeUpdatedDocketEntry.docketEntryId,
            });

          const memberServedParties =
            aggregatePartiesForService(memberCaseEntity);

          memberNoticeUpdatedDocketEntry.setAsServed(memberServedParties.all);

          memberCaseEntity.addDocketEntry(memberNoticeUpdatedDocketEntry);

          const serviceStampDate = formatDateString(
            memberNoticeUpdatedDocketEntry.servedAt!,
            FORMATS.MMDDYY,
          );

          const pdfData = await applicationContext
            .getPersistenceGateway()
            .getDocument({
              applicationContext,
              key: memberNoticeUpdatedDocketEntry.docketEntryId,
            });

          const newPdfData = await addServedStampToDocument({
            applicationContext,
            pdfData,
            serviceStampText: `Served ${serviceStampDate}`,
          });

          await applicationContext
            .getPersistenceGateway()
            .saveDocumentFromLambda({
              document: newPdfData,
              key: memberNoticeUpdatedDocketEntry.docketEntryId,
            });

          const paperServiceResult = await applicationContext
            .getUseCaseHelpers()
            .serveDocumentAndGetPaperServicePdf({
              applicationContext,
              caseEntities: [memberCaseEntity],
              docketEntryId: memberNoticeUpdatedDocketEntry.docketEntryId,
            });

          if (memberServedParties.paper.length > 0) {
            paperServiceResults.push({
              docketNumber: memberCaseEntity.docketNumber,
              pdfUrl: paperServiceResult && paperServiceResult.pdfUrl,
              documentTitle: memberNoticeUpdatedDocketEntry.documentTitle,
              parties: memberServedParties.paper,
            });
          }
        } catch (err) {
          applicationContext.logger?.error(
            `Failed to generate NODC for docketEntryId ${docketEntryId} on case ${de.docketNumber}: ${err}`,
          );
        }
      }
    } else {
      const noticeDocketEntryId = await generateNoticeOfDocketChangePdf({
        applicationContext,
        authorizedUser,
        // @ts-ignore
        docketChangeInfo,
      });

      const noticeUpdatedDocketEntry = new DocketEntry(
        {
          ...SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange,
          docketEntryId: noticeDocketEntryId,
          documentTitle: replaceBracketed(
            SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange.documentTitle,
            // @ts-ignore
            docketChangeInfo.docketEntryIndex,
          ),
          isFileAttached: true,
          isOnDocketRecord: true,
          processingStatus: DOCUMENT_PROCESSING_STATUS_OPTIONS.COMPLETE,
        },
        { authorizedUser, petitioners: caseToUpdate.petitioners },
      );

      noticeUpdatedDocketEntry.setFiledBy(user);

      noticeUpdatedDocketEntry.numberOfPages = await applicationContext
        .getUseCaseHelpers()
        .countPagesInDocument({
          applicationContext,
          docketEntryId: noticeUpdatedDocketEntry.docketEntryId,
        });

      noticeUpdatedDocketEntry.setAsServed(servedParties.all);

      caseEntity.addDocketEntry(noticeUpdatedDocketEntry);

      const serviceStampDate = formatDateString(
        noticeUpdatedDocketEntry.servedAt!,
        FORMATS.MMDDYY,
      );

      const pdfData = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          key: noticeUpdatedDocketEntry.docketEntryId,
        });

      const newPdfData = await addServedStampToDocument({
        applicationContext,
        pdfData,
        serviceStampText: `Served ${serviceStampDate}`,
      });

      await applicationContext.getPersistenceGateway().saveDocumentFromLambda({
        document: newPdfData,
        key: noticeUpdatedDocketEntry.docketEntryId,
      });

      const paperServiceResult = await applicationContext
        .getUseCaseHelpers()
        .serveDocumentAndGetPaperServicePdf({
          applicationContext,
          caseEntities: [caseEntity],
          docketEntryId: noticeUpdatedDocketEntry.docketEntryId,
        });

      if (servedParties.paper.length > 0) {
        paperServicePdfUrl = paperServiceResult && paperServiceResult.pdfUrl;
        paperServiceDocumentTitle = noticeUpdatedDocketEntry.documentTitle;
      }
    }

    // aggregate paperServiceParties across cases
    if (
      Array.isArray(docketEntriesAcrossCases) &&
      docketEntriesAcrossCases.length
    ) {
      const aggregatedPaperParties: any[] = [];
      for (const de of docketEntriesAcrossCases) {
        try {
          const memberCaseRaw = await getCaseByDocketNumber({
            docketNumber: de.docketNumber,
          });
          if (!memberCaseRaw) continue;
          const memberCaseEntity = new Case(memberCaseRaw, { authorizedUser });
          const memberServedParties =
            aggregatePartiesForService(memberCaseEntity);
          aggregatedPaperParties.push(...memberServedParties.paper);
        } catch (err) {
          applicationContext.logger?.error(
            `Failed to aggregate paper parties for docketEntryId ${docketEntryId} on case ${de.docketNumber}: ${err}`,
          );
        }
      }

      // set paperServiceParties to aggregated list if not empty
      if (aggregatedPaperParties.length > 0) {
        // remove duplicates by name
        paperServiceParties = Array.from(
          new Map(aggregatedPaperParties.map(p => [p.name, p])).values(),
        );
      }
      // include detailed results as an additional return field
      paperServicePdfUrl = paperServiceResults.length
        ? paperServiceResults[0].pdfUrl
        : paperServicePdfUrl;
      paperServiceDocumentTitle = paperServiceResults.length
        ? paperServiceResults[0].documentTitle
        : paperServiceDocumentTitle;
    }
  }

  await updateCaseAndAssociations({
    authorizedUser,
    caseToUpdate: caseEntity,
  });

  if (isNewCoverSheetNeeded) {
    await applicationContext.getUseCases().addCoversheetInteractor(
      applicationContext,
      {
        docketEntryId,
        docketNumber: caseEntity.docketNumber,
      },
      authorizedUser,
    );
  }

  return {
    caseDetail: caseEntity.toRawObject(),
    paperServiceDocumentTitle,
    paperServiceParties,
    paperServicePdfUrl,
  };
};

export const completeDocketEntryQCInteractor = withLocking(
  completeDocketEntryQC,
  (_applicationContext: ServerApplicationContext, { entryMetadata }) => ({
    identifiers: [`docket-entry|${entryMetadata.docketEntryId}`],
  }),
  new InvalidRequest('The document is currently being updated'),
);

export const needsNewCoversheet = ({
  applicationContext,
  currentDocketEntry,
  updatedDocketEntry,
}) => {
  const receivedAtUpdated =
    dateStringsCompared(
      currentDocketEntry.receivedAt,
      updatedDocketEntry.receivedAt,
    ) !== 0;
  const certificateOfServiceUpdated =
    currentDocketEntry.certificateOfService !==
    updatedDocketEntry.certificateOfService;
  const documentTitleUpdated =
    applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo({
      docketEntry: currentDocketEntry,
    }) !==
    applicationContext.getUtilities().getDocumentTitleWithAdditionalInfo({
      docketEntry: updatedDocketEntry,
    });

  return (
    receivedAtUpdated || certificateOfServiceUpdated || documentTitleUpdated
  );
};
