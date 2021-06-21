const {
  INITIAL_DOCUMENT_TYPES,
  INITIAL_DOCUMENT_TYPES_MAP,
  MINUTE_ENTRIES_MAP,
  PAYMENT_STATUS,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  isAuthorized,
  ROLE_PERMISSIONS,
} = require('../../../authorization/authorizationClientService');
const { Case } = require('../../entities/cases/Case');
const { DocketEntry } = require('../../entities/DocketEntry');
const { getCaseCaptionMeta } = require('../../utilities/getCaseCaptionMeta');
const { PETITIONS_SECTION } = require('../../entities/EntityConstants');
const { remove } = require('lodash');
const { UnauthorizedError } = require('../../../errors/errors');

exports.addDocketEntryForPaymentStatus = ({
  applicationContext,
  caseEntity,
  user,
}) => {
  if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.PAID) {
    caseEntity.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: 'Filing Fee Paid',
          documentType: MINUTE_ENTRIES_MAP.filingFeePaid.documentType,
          eventCode: MINUTE_ENTRIES_MAP.filingFeePaid.eventCode,
          filingDate: caseEntity.petitionPaymentDate,
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId: user.userId,
        },
        { applicationContext },
      ),
    );
  } else if (caseEntity.petitionPaymentStatus === PAYMENT_STATUS.WAIVED) {
    caseEntity.addDocketEntry(
      new DocketEntry(
        {
          documentTitle: 'Filing Fee Waived',
          documentType: MINUTE_ENTRIES_MAP.filingFeeWaived.documentType,
          eventCode: MINUTE_ENTRIES_MAP.filingFeeWaived.eventCode,
          filingDate: caseEntity.petitionPaymentWaivedDate,
          isFileAttached: false,
          isMinuteEntry: true,
          isOnDocketRecord: true,
          processingStatus: 'complete',
          userId: user.userId,
        },
        { applicationContext },
      ),
    );
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

/**
 * serveCaseToIrsInteractor
 *
 * @param {object} applicationContext the application context
 * @param {object} providers the providers object
 * @param {string} providers.docketNumber the docket number of the case
 * @returns {Buffer} paper service pdf if the case is a paper case
 */
exports.serveCaseToIrsInteractor = async (
  applicationContext,
  { docketNumber },
) => {
  const user = applicationContext.getCurrentUser();

  if (!isAuthorized(user, ROLE_PERMISSIONS.SERVE_PETITION)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const caseToBatch = await applicationContext
    .getPersistenceGateway()
    .getCaseByDocketNumber({
      applicationContext,
      docketNumber,
    });

  const caseEntity = new Case(caseToBatch, { applicationContext });

  caseEntity.markAsSentToIRS();

  if (caseEntity.isPaper) {
    addDocketEntries({ caseEntity });
  }

  for (const initialDocumentTypeKey of Object.keys(INITIAL_DOCUMENT_TYPES)) {
    const initialDocumentType = INITIAL_DOCUMENT_TYPES[initialDocumentTypeKey];

    const initialDocketEntry = caseEntity.docketEntries.find(
      doc => doc.documentType === initialDocumentType.documentType,
    );

    if (initialDocketEntry && !initialDocketEntry.isMinuteEntry) {
      initialDocketEntry.setAsServed([
        {
          name: 'IRS',
          role: ROLES.irsSuperuser,
        },
      ]);
      caseEntity.updateDocketEntry(initialDocketEntry);

      if (
        initialDocketEntry.documentType ===
        INITIAL_DOCUMENT_TYPES.petition.documentType
      ) {
        await applicationContext
          .getUseCaseHelpers()
          .sendIrsSuperuserPetitionEmail({
            applicationContext,
            caseEntity,
            docketEntryId: initialDocketEntry.docketEntryId,
          });
      } else {
        await applicationContext.getUseCaseHelpers().sendServedPartiesEmails({
          applicationContext,
          caseEntity,
          docketEntryId: initialDocketEntry.docketEntryId,
          servedParties: {
            //IRS superuser is served every document by default, so we don't need to explicitly include them as a party here
            electronic: [],
          },
        });
      }
    }
  }

  exports.addDocketEntryForPaymentStatus({
    applicationContext,
    caseEntity,
    user,
  });

  caseEntity
    .updateCaseCaptionDocketRecord({ applicationContext })
    .updateDocketNumberRecord({ applicationContext })
    .validate();

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

  await applicationContext.getPersistenceGateway().updateWorkItem({
    applicationContext,
    workItemToUpdate: initializeCaseWorkItem.validate().toRawObject(),
  });
  const caseWithServedDocketEntryInformation = await applicationContext
    .getUseCaseHelpers()
    .updateCaseAndAssociations({
      applicationContext,
      caseToUpdate: caseEntity,
    });

  const caseEntityToUpdate = new Case(caseWithServedDocketEntryInformation, {
    applicationContext,
  });

  for (const doc of caseEntityToUpdate.docketEntries) {
    if (doc.isFileAttached) {
      const updatedDocketEntry = await applicationContext
        .getUseCases()
        .addCoversheetInteractor(applicationContext, {
          docketEntryId: doc.docketEntryId,
          docketNumber: caseEntityToUpdate.docketNumber,
          replaceCoversheet: !caseEntityToUpdate.isPaper,
          useInitialData: !caseEntityToUpdate.isPaper,
        });

      caseEntityToUpdate.updateDocketEntry(updatedDocketEntry);
    }
  }

  const { caseCaptionExtension, caseTitle } =
    getCaseCaptionMeta(caseEntityToUpdate);
  const { docketNumberWithSuffix, preferredTrialCity, receivedAt } =
    caseEntityToUpdate;

  let pdfData = await applicationContext
    .getDocumentGenerators()
    .noticeOfReceiptOfPetition({
      applicationContext,
      data: {
        address: caseEntityToUpdate.petitioners[0],
        caseCaptionExtension,
        caseTitle,
        docketNumberWithSuffix,
        preferredTrialCity,
        receivedAtFormatted: applicationContext
          .getUtilities()
          .formatDateString(receivedAt, 'MMMM D, YYYY'),
        servedDate: applicationContext
          .getUtilities()
          .formatDateString(
            caseEntityToUpdate.getIrsSendDate(),
            'MMMM D, YYYY',
          ),
      },
    });

  const contactSecondary = caseEntityToUpdate.petitioners[1];
  if (contactSecondary) {
    const contactInformationDiff = applicationContext
      .getUtilities()
      .getAddressPhoneDiff({
        newData: caseEntityToUpdate.petitioners[0],
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

    const contactAddressesAreDifferent = Object.keys(
      contactInformationDiff,
    ).some(field => addressFields.includes(field));

    let secondaryPdfData;

    if (contactAddressesAreDifferent) {
      secondaryPdfData = await applicationContext
        .getDocumentGenerators()
        .noticeOfReceiptOfPetition({
          applicationContext,
          data: {
            address: contactSecondary,
            caseCaptionExtension,
            caseTitle,
            docketNumberWithSuffix,
            preferredTrialCity,
            receivedAtFormatted: applicationContext
              .getUtilities()
              .formatDateString(receivedAt, 'MMMM D, YYYY'),
            servedDate: applicationContext
              .getUtilities()
              .formatDateString(
                caseEntityToUpdate.getIrsSendDate(),
                'MMMM D, YYYY',
              ),
          },
        });

      const { PDFDocument } = await applicationContext.getPdfLib();
      const pdfDoc = await PDFDocument.load(pdfData);
      const secondaryPdfDoc = await PDFDocument.load(secondaryPdfData);
      const coverPageDocumentPages = await pdfDoc.copyPages(
        secondaryPdfDoc,
        secondaryPdfDoc.getPageIndices(),
      );
      pdfDoc.insertPage(1, coverPageDocumentPages[0]);

      const pdfDataBuffer = await pdfDoc.save();
      pdfData = Buffer.from(pdfDataBuffer);
    }
  }

  const caseConfirmationPdfName =
    caseEntityToUpdate.getCaseConfirmationGeneratedPdfFileName();

  await new Promise((resolve, reject) => {
    const documentsBucket = applicationContext.getDocumentsBucketName();
    const s3Client = applicationContext.getStorageClient();

    const params = {
      Body: pdfData,
      Bucket: documentsBucket,
      ContentType: 'application/pdf',
      Key: caseConfirmationPdfName,
    };

    s3Client.upload(params, function (err) {
      if (err) {
        applicationContext.logger.error(
          'An error occurred while attempting to upload to S3',
          err,
        );
        reject(err);
      }

      resolve();
    });
  });

  let urlToReturn;

  if (caseEntityToUpdate.isPaper) {
    ({ url: urlToReturn } = await applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl({
        applicationContext,
        key: caseConfirmationPdfName,
        useTempBucket: false,
      }));
  }

  await applicationContext.getUseCaseHelpers().updateCaseAndAssociations({
    applicationContext,
    caseToUpdate: caseEntityToUpdate,
  });

  return urlToReturn;
};
