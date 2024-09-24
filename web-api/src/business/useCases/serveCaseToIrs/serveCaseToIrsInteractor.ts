/* eslint-disable complexity */
import {
  AuthUser,
  UnknownAuthUser,
} from '@shared/business/entities/authUser/AuthUser';
import { Case } from '../../../../../shared/src/business/entities/cases/Case';
import { DocketEntry } from '../../../../../shared/src/business/entities/DocketEntry';
import {
  FORMATS,
  formatDateString,
  formatNow,
  getBusinessDateInFuture,
} from '../../../../../shared/src/business/utilities/DateHandler';
import {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
  MINUTE_ENTRIES_MAP,
  PARTIES_CODES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../../../shared/src/authorization/authorizationClientService';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { aggregatePartiesForService } from '../../../../../shared/src/business/utilities/aggregatePartiesForService';
import { generateDraftDocument } from './generateDraftDocument';
import { getCaseCaptionMeta } from '../../../../../shared/src/business/utilities/getCaseCaptionMeta';
import { getClinicLetterKey } from '../../../../../shared/src/business/utilities/getClinicLetterKey';
import { random, remove } from 'lodash';
import { withLocking } from '@web-api/business/useCaseHelper/acquireLock';
import { saveWorkItem } from '@web-api/persistence/postgres/workitems/saveWorkItem';

export const addDocketEntryForPaymentStatus = ({ caseEntity, user }) => {
  if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.PAID) {
    const paymentStatusDocketEntry = new DocketEntry(
      {
        documentTitle: 'Filing Fee Paid',
        documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
        eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
        filingDate: caseEntity.petitionPaymentDate,
        isFileAttached: false,
        isOnDocketRecord: true,
        processingStatus: 'complete',
      },
      { authorizedUser: user },
    );

    paymentStatusDocketEntry.setFiledBy(user);

    caseEntity.addDocketEntry(paymentStatusDocketEntry);
  } else if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.WAIVED) {
    const petitionPaymentStatusDocketEntry = new DocketEntry(
      {
        documentTitle: 'Filing Fee Waived',
        documentType: MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
        eventCode: MINUTE_ENTRIES_MAP.filingFeeWaived.eventCode,
        filingDate: caseEntity.petitionPaymentWaivedDate,
        isFileAttached: false,
        isOnDocketRecord: true,
        processingStatus: 'complete',
      },
      { authorizedUser: user },
    );

    petitionPaymentStatusDocketEntry.setFiledBy(user);

    caseEntity.addDocketEntry(petitionPaymentStatusDocketEntry);
  }
};

const addDocketEntries = ({ caseEntity }) => {
  const initialDocumentTypesListRequiringDocketEntry = Object.values(
    INITIAL_DOCUMENT_TYPES_MAP,
  );

  remove(
    initialDocumentTypesListRequiringDocketEntry,
    doc =>
      doc === INITIAL_DOCUMENT_TYPES.petition.documentType ||
      doc === INITIAL_DOCUMENT_TYPES.stin.documentType,
  );

  for (let documentType of initialDocumentTypesListRequiringDocketEntry) {
    const foundDocketEntry = caseEntity.docketEntries.find(
      caseDocument => caseDocument.documentType === documentType,
    );

    if (foundDocketEntry) {
      foundDocketEntry.isOnDocketRecord = true;
      caseEntity.updateDocketEntry(foundDocketEntry);
    }
  }
};

const createPetitionWorkItems = async ({
  applicationContext,
  caseEntity,
  user,
}) => {
  const petitionDocument = caseEntity.docketEntries.find(
    doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
  );
  const initializeCaseWorkItem = petitionDocument.workItem;

  initializeCaseWorkItem.docketEntry.servedAt = petitionDocument.servedAt;
  initializeCaseWorkItem.caseTitle = Case.getCaseTitle(caseEntity.caseCaption);
  initializeCaseWorkItem.docketNumberWithSuffix =
    caseEntity.docketNumberWithSuffix;

  initializeCaseWorkItem.setAsCompleted({
    message: 'Served to IRS',
    user,
  });

  await applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox({
    applicationContext,
    section: PETITIONS_SECTION,
    userId: user.userId,
    workItem: initializeCaseWorkItem.validate().toRawObject(),
  });

  await saveWorkItem({
    workItem: initializeCaseWorkItem.validate().toRawObject(),
  });
};

const generateAccessCode = () => {
  const randomNumber = random(0, 999999);
  const accessCode = ('000000' + randomNumber).slice(-6);
  return accessCode;
};

const generateNoticeOfReceipt = async ({
  applicationContext,
  caseEntity,
  userServingPetition,
}) => {
  const { caseCaptionExtension, caseTitle } = getCaseCaptionMeta(caseEntity);

  const {
    docketNumberWithSuffix,
    preferredTrialCity,
    procedureType,
    receivedAt,
  } = caseEntity;

  const contactPrimary = caseEntity.getContactPrimary();

  let accessCode = generateAccessCode();

  const { name, title } = await applicationContext
    .getPersistenceGateway()
    .getConfigurationItemValue({
      applicationContext,
      configurationItemKey:
        applicationContext.getConstants().CLERK_OF_THE_COURT_CONFIGURATION,
    });

  let primaryContactNotrPdfData = await applicationContext
    .getDocumentGenerators()
    .noticeOfReceiptOfPetition({
      applicationContext,
      data: {
        accessCode,
        caseCaptionExtension,
        caseTitle,
        contact: contactPrimary,
        docketNumberWithSuffix,
        nameOfClerk: name,
        preferredTrialCity,
        receivedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(receivedAt, 'MONTH_DAY_YEAR'),
        servedDate: applicationContext
          .getUtilities()
          .formatDateString(caseEntity.getIrsSendDate(), 'MONTH_DAY_YEAR'),
        titleOfClerk: title,
      },
    });

  let secondaryContactNotrPdfData;
  const contactSecondary = caseEntity.getContactSecondary();
  const addressesAreDifferent = contactAddressesAreDifferent({
    applicationContext,
    caseEntity,
  });

  const isSetupForEService = contactInfo => {
    return (
      contactInfo.hasConsentedToEService && !!contactInfo.paperPetitionEmail
    );
  };

  const petitionerIsSetupForEService =
    contactSecondary &&
    [contactPrimary, contactSecondary].some(contact => {
      return isSetupForEService(contact) === true;
    });

  const shouldGenerateNotrForSecondary =
    addressesAreDifferent || petitionerIsSetupForEService;

  if (shouldGenerateNotrForSecondary) {
    if (
      contactPrimary.paperPetitionEmail !== contactSecondary.paperPetitionEmail
    ) {
      accessCode = generateAccessCode();
    }

    secondaryContactNotrPdfData = await applicationContext
      .getDocumentGenerators()
      .noticeOfReceiptOfPetition({
        applicationContext,
        data: {
          accessCode,
          caseCaptionExtension,
          caseTitle,
          contact: contactSecondary,
          docketNumberWithSuffix,
          nameOfClerk: name,
          preferredTrialCity,
          receivedAtFormatted: applicationContext
            .getUtilities()
            .formatDateString(receivedAt, 'MONTH_DAY_YEAR'),
          servedDate: applicationContext
            .getUtilities()
            .formatDateString(caseEntity.getIrsSendDate(), 'MONTH_DAY_YEAR'),
          titleOfClerk: title,
        },
      });
  }

  let clinicLetter;
  const isPrimaryContactProSe = !Case.isPetitionerRepresented(
    caseEntity,
    contactPrimary.contactId,
  );
  const isSecondaryContactProSe =
    !!contactSecondary &&
    !Case.isPetitionerRepresented(caseEntity, contactSecondary.contactId);

  if (
    shouldIncludeClinicLetter(
      preferredTrialCity,
      isPrimaryContactProSe,
      contactSecondary,
      addressesAreDifferent,
      isSecondaryContactProSe,
    )
  ) {
    const clinicLetterKey = getClinicLetterKey({
      procedureType,
      trialLocation: preferredTrialCity,
    });

    const doesClinicLetterExist = await applicationContext
      .getPersistenceGateway()
      .isFileExists({
        applicationContext,
        key: clinicLetterKey,
      });

    if (doesClinicLetterExist) {
      clinicLetter = await applicationContext
        .getPersistenceGateway()
        .getDocument({
          applicationContext,
          key: clinicLetterKey,
          useTempBucket: false,
        });
    }
  }

  if (clinicLetter && isPrimaryContactProSe) {
    primaryContactNotrPdfData = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        applicationContext,
        firstPdf: primaryContactNotrPdfData,
        secondPdf: clinicLetter,
      });
  }

  if (clinicLetter && secondaryContactNotrPdfData && isSecondaryContactProSe) {
    secondaryContactNotrPdfData = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        applicationContext,
        firstPdf: secondaryContactNotrPdfData,
        secondPdf: clinicLetter,
      });
  }

  let combinedNotrPdfData = primaryContactNotrPdfData;
  if (secondaryContactNotrPdfData) {
    combinedNotrPdfData = await applicationContext
      .getUtilities()
      .combineTwoPdfs({
        applicationContext,
        firstPdf: primaryContactNotrPdfData,
        secondPdf: secondaryContactNotrPdfData,
      });
  }

  const caseConfirmationPdfName =
    caseEntity.getCaseConfirmationGeneratedPdfFileName();

  await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    pdfData: Buffer.from(combinedNotrPdfData),
    pdfName: caseConfirmationPdfName,
  });

  const notrDocketEntryId = applicationContext.getUniqueId();
  await applicationContext.getPersistenceGateway().uploadDocument({
    applicationContext,
    pdfData: Buffer.from(combinedNotrPdfData),
    pdfName: notrDocketEntryId,
  });

  let urlToReturn;

  const notrDocketEntry = new DocketEntry(
    {
      docketEntryId: notrDocketEntryId,
      documentTitle:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfReceiptOfPetition.documentTitle,
      documentType:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfReceiptOfPetition.documentType,
      eventCode:
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfReceiptOfPetition.eventCode,
      isFileAttached: true,
      isOnDocketRecord: true,
    },
    {
      authorizedUser: userServingPetition,
      petitioners: caseEntity.petitioners,
    },
  );

  notrDocketEntry.setFiledBy(userServingPetition);

  const servedParties = aggregatePartiesForService(caseEntity);
  notrDocketEntry.setAsServed(servedParties.all);
  notrDocketEntry.servedPartiesCode = PARTIES_CODES.PETITIONER; //overwrite the served party code for the NOTR docket entry because this is a special one-off with special rules that don't follow the normal party code algorithm
  notrDocketEntry.setAsProcessingStatusAsCompleted();

  notrDocketEntry.numberOfPages = await applicationContext
    .getUseCaseHelpers()
    .countPagesInDocument({
      applicationContext,
      documentBytes: combinedNotrPdfData,
    });

  caseEntity.addDocketEntry(notrDocketEntry);

  await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
    applicationContext,
    caseEntity,
    docketEntryId: notrDocketEntry.docketEntryId,
    servedParties,
    skipEmailToIrs: true,
  });

  if (caseEntity.isPaper) {
    ({ url: urlToReturn } = await applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl({
        applicationContext,
        key: notrDocketEntry.docketEntryId,
        useTempBucket: false,
      }));
  }

  return urlToReturn;
};

const shouldIncludeClinicLetter = (
  preferredTrialCity,
  isPrimaryContactProSe,
  contactSecondary,
  addressesAreDifferent,
  isSecondaryContactProSe,
) => {
  const primaryIsProSe_And_NoSecondary =
    isPrimaryContactProSe && !contactSecondary;

  const primaryIsProSe_And_SecondaryExists_And_SameAddress_SecondaryIsProSe =
    isPrimaryContactProSe &&
    contactSecondary &&
    !addressesAreDifferent &&
    isSecondaryContactProSe;

  const primaryIsProSe_And_SecondaryExists_And_DifferentAddress =
    isPrimaryContactProSe && contactSecondary && addressesAreDifferent; //it doesn't matter whether the secondary is pro se or not, as long as the primary is pro se and we have different addresses

  const primaryNotProSe_And_SecondaryExists_And_DifferentAddress_And_SecondaryIsProSe =
    !isPrimaryContactProSe &&
    contactSecondary &&
    addressesAreDifferent &&
    isSecondaryContactProSe;

  return (
    preferredTrialCity &&
    (primaryIsProSe_And_NoSecondary ||
      primaryIsProSe_And_SecondaryExists_And_SameAddress_SecondaryIsProSe ||
      primaryIsProSe_And_SecondaryExists_And_DifferentAddress ||
      primaryNotProSe_And_SecondaryExists_And_DifferentAddress_And_SecondaryIsProSe)
  );
};

const createCoversheetsForServedEntries = async ({
  applicationContext,
  authorizedUser,
  caseEntity,
}: {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  authorizedUser: AuthUser;
}) => {
  return await Promise.all(
    caseEntity.docketEntries.map(async doc => {
      if (doc.isFileAttached && !doc.isDraft) {
        const updatedDocketEntry = await applicationContext
          .getUseCases()
          .addCoversheetInteractor(
            applicationContext,
            {
              caseEntity,
              docketEntryId: doc.docketEntryId,
              docketNumber: caseEntity.docketNumber,
              replaceCoversheet: !caseEntity.isPaper,
              useInitialData: !caseEntity.isPaper,
            },
            authorizedUser,
          );

        caseEntity.updateDocketEntry(updatedDocketEntry);
      }
    }),
  );
};

const contactAddressesAreDifferent = ({ applicationContext, caseEntity }) => {
  const contactSecondary = caseEntity.getContactSecondary();

  if (!contactSecondary) {
    return false;
  }

  const contactInformationDiff = applicationContext
    .getUtilities()
    .getAddressPhoneDiff({
      newData: caseEntity.getContactPrimary(),
      oldData: contactSecondary,
    });

  const addressFields = [
    'country',
    'countryType',
    'address1',
    'address2',
    'address3',
    'city',
    'state',
    'postalCode',
  ];

  return Object.keys(contactInformationDiff).some(field =>
    addressFields.includes(field),
  );
};

export const serveCaseToIrs = async (
  applicationContext: ServerApplicationContext,
  {
    clientConnectionId,
    docketNumber,
  }: { clientConnectionId: string; docketNumber: string },
  authorizedUser: UnknownAuthUser,
): Promise<void> => {
  try {
    if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.SERVE_PETITION)) {
      throw new UnauthorizedError('Unauthorized');
    }

    const caseToBatch = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    let caseEntity = new Case(caseToBatch, { authorizedUser });

    caseEntity.markAsSentToIRS();

    if (caseEntity.isPaper) {
      addDocketEntries({ caseEntity });
    }

    for (const initialDocumentTypeKey of Object.keys(INITIAL_DOCUMENT_TYPES)) {
      await applicationContext.getUtilities().serveCaseDocument({
        applicationContext,
        caseEntity,
        initialDocumentTypeKey,
      });
    }

    addDocketEntryForPaymentStatus({
      caseEntity,
      user: authorizedUser,
    });

    caseEntity
      .updateCaseCaptionDocketRecord({ authorizedUser })
      .updateDocketNumberRecord({ authorizedUser })
      .validate();

    const generatedDocuments: Promise<any>[] = [];

    if (caseEntity.noticeOfAttachments) {
      const { noticeOfAttachmentsInNatureOfEvidence } =
        SYSTEM_GENERATED_DOCUMENT_TYPES;
      generatedDocuments.push(
        applicationContext
          .getUseCaseHelpers()
          .addDocketEntryForSystemGeneratedOrder({
            applicationContext,
            authorizedUser,
            caseEntity,
            systemGeneratedDocument: noticeOfAttachmentsInNatureOfEvidence,
          }),
      );
    }

    const petitionDocument = caseEntity.docketEntries.find(
      doc => doc.documentType === INITIAL_DOCUMENT_TYPES.petition.documentType,
    );

    const formattedFiledDate = formatDateString(
      petitionDocument.filingDate,
      FORMATS.MONTH_DAY_YEAR,
    );

    if (caseEntity.orderDesignatingPlaceOfTrial) {
      const { orderDesignatingPlaceOfTrial } = SYSTEM_GENERATED_DOCUMENT_TYPES;

      generatedDocuments.push(
        generateDraftDocument({
          applicationContext,
          authorizedUser,
          caseEntity,
          document: orderDesignatingPlaceOfTrial,
          replacements: [
            formattedFiledDate,
            caseEntity.procedureType.toLowerCase(),
          ],
        }),
      );
    }

    const todayPlus30 = getBusinessDateInFuture({
      numberOfDays: 30,
      startDate: formatNow(FORMATS.ISO),
    });

    if (caseEntity.orderForFilingFee) {
      const { orderForFilingFee } = SYSTEM_GENERATED_DOCUMENT_TYPES;

      generatedDocuments.push(
        generateDraftDocument({
          applicationContext,
          authorizedUser,
          caseEntity,
          document: orderForFilingFee,
          replacements: [todayPlus30, todayPlus30],
        }),
      );
    }

    if (caseEntity.orderForAmendedPetitionAndFilingFee) {
      const { orderForAmendedPetitionAndFilingFee } =
        SYSTEM_GENERATED_DOCUMENT_TYPES;

      generatedDocuments.push(
        generateDraftDocument({
          applicationContext,
          authorizedUser,
          caseEntity,
          document: orderForAmendedPetitionAndFilingFee,
          replacements: [formattedFiledDate, todayPlus30, todayPlus30],
        }),
      );
    }

    const todayPlus60 = getBusinessDateInFuture({
      numberOfDays: 60,
      startDate: formatNow(FORMATS.ISO),
    });

    if (caseEntity.orderForAmendedPetition) {
      const { orderForAmendedPetition } = SYSTEM_GENERATED_DOCUMENT_TYPES;

      generatedDocuments.push(
        generateDraftDocument({
          applicationContext,
          authorizedUser,
          caseEntity,
          document: orderForAmendedPetition,
          replacements: [formattedFiledDate, todayPlus60, todayPlus60],
        }),
      );
    }

    if (caseEntity.orderToShowCause) {
      // OSCP, not OSC
      const { orderPetitionersToShowCause } = SYSTEM_GENERATED_DOCUMENT_TYPES;

      generatedDocuments.push(
        generateDraftDocument({
          applicationContext,
          authorizedUser,
          caseEntity,
          document: orderPetitionersToShowCause,
          replacements: [formattedFiledDate, todayPlus60],
        }),
      );
    }

    await Promise.all(generatedDocuments);

    await createPetitionWorkItems({
      applicationContext,
      caseEntity,
      user: authorizedUser,
    });

    await createCoversheetsForServedEntries({
      applicationContext,
      authorizedUser,
      caseEntity,
    });

    const urlToReturn = await generateNoticeOfReceipt({
      applicationContext,
      caseEntity,
      userServingPetition: authorizedUser,
    });

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      authorizedUser,
      caseToUpdate: caseEntity,
    });

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'serve_to_irs_complete',
        pdfUrl: urlToReturn,
      },
      userId: authorizedUser.userId,
    });
  } catch (err) {
    applicationContext.logger.error('Error serving case to IRS', {
      docketNumber,
      error: err,
    });
    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'serve_to_irs_error',
      },
      userId: authorizedUser?.userId || '',
    });
  }
};

export const serveCaseToIrsInteractor = withLocking(
  serveCaseToIrs,
  (_applicationContext: ServerApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
