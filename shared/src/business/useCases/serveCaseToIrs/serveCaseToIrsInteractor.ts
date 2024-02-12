/* eslint-disable complexity */
import { Case } from '../../entities/cases/Case';
import { DocketEntry } from '../../entities/DocketEntry';
import {
  FORMATS,
  formatDateString,
  formatNow,
  getBusinessDateInFuture,
} from '../../utilities/DateHandler';
import {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
  MINUTE_ENTRIES_MAP,
  PARTIES_CODES,
  PAYMENT_STATUS,
  PETITIONS_SECTION,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
} from '../../entities/EntityConstants';
import {
  ROLE_PERMISSIONS,
  isAuthorized,
} from '../../../authorization/authorizationClientService';
import { UnauthorizedError } from '@web-api/errors/errors';
import { aggregatePartiesForService } from '../../utilities/aggregatePartiesForService';
import { generateDraftDocument } from './generateDraftDocument';
import { getCaseCaptionMeta } from '../../utilities/getCaseCaptionMeta';
import { getClinicLetterKey } from '../../utilities/getClinicLetterKey';
import { random, remove } from 'lodash';
import { withLocking } from '@shared/business/useCaseHelper/acquireLock';

export const addDocketEntryForPaymentStatus = ({
  applicationContext,
  caseEntity,
  user,
}) => {
  if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.PAID) {
    const paymentStatusDocketEntry = new DocketEntry(
      {
        documentTitle: 'Filing Fee Paid',
        documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
        eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
        filingDate: caseEntity.petitionPaymentDate,
        isFileAttached: false,
        isMinuteEntry: true,
        isOnDocketRecord: true,
        processingStatus: 'complete',
      },
      { applicationContext },
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
        isMinuteEntry: true,
        isOnDocketRecord: true,
        processingStatus: 'complete',
      },
      { applicationContext },
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

  await applicationContext.getPersistenceGateway().saveWorkItem({
    applicationContext,
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

  await applicationContext.getUtilities().uploadToS3({
    applicationContext,
    pdfData: Buffer.from(combinedNotrPdfData),
    pdfName: caseConfirmationPdfName,
  });

  const notrDocketEntryId = applicationContext.getUniqueId();
  await applicationContext.getUtilities().uploadToS3({
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
    { applicationContext, petitioners: caseEntity.petitioners },
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
  caseEntity,
}) => {
  return await Promise.all(
    caseEntity.docketEntries.map(async doc => {
      if (doc.isFileAttached) {
        const updatedDocketEntry = await applicationContext
          .getUseCases()
          .addCoversheetInteractor(applicationContext, {
            caseEntity,
            docketEntryId: doc.docketEntryId,
            docketNumber: caseEntity.docketNumber,
            replaceCoversheet: !caseEntity.isPaper,
            useInitialData: !caseEntity.isPaper,
          });

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

/**
 * serveCaseToIrs
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Buffer} paper service pdf if the case is a paper case
 */
export const serveCaseToIrs = async (
  applicationContext,
  { clientConnectionId, docketNumber },
) => {
  const user = applicationContext.getCurrentUser();
  try {
    if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_PETITION)) {
      throw new UnauthorizedError('Unauthorized');
    }
    // throw new Error('jtd:: something broke');
    const caseToBatch = await applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber({
        applicationContext,
        docketNumber,
      });

    let caseEntity = new Case(caseToBatch, { applicationContext });

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
      applicationContext,
      caseEntity,
      user,
    });

    caseEntity
      .updateCaseCaptionDocketRecord({ applicationContext })
      .updateDocketNumberRecord({ applicationContext })
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
      user,
    });

    await createCoversheetsForServedEntries({
      applicationContext,
      caseEntity,
    });

    const urlToReturn = await generateNoticeOfReceipt({
      applicationContext,
      caseEntity,
      userServingPetition: user,
    });

    await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

    await applicationContext.getNotificationGateway().sendNotificationToUser({
      applicationContext,
      clientConnectionId,
      message: {
        action: 'serve_to_irs_complete',
        pdfUrl: urlToReturn,
      },
      userId: user.userId,
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
      userId: user.userId,
    });
  }
};

export const serveCaseToIrsInteractor = withLocking(
  serveCaseToIrs,
  (_applicationContext: IApplicationContext, { docketNumber }) => ({
    identifiers: [`case|${docketNumber}`],
  }),
);
