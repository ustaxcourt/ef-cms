import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import {
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getCaseByDocketNumber } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getUserById } from '@web-api/persistence/postgres/users/getUserById';
import { PDFDocument } from 'pdf-lib';

export const generateNoticeOfWithdrawalPdfInteractor = async (
  applicationContext: ServerApplicationContext,
  {
    caseCaptionExtension,
    caseTitle,
    docketNumber,
    docketNumberWithSuffix,
    partiesToWithdrawFrom,
    petitioners,
  }: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumber: string;
    docketNumberWithSuffix: string;
    partiesToWithdrawFrom: string[];
    petitioners: {
      contactId: string;
      name: string;
    }[];
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ fileId: string; url: string }> => {
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitionerInformation = await getUserById({
    userId: authorizedUser.userId,
  });

  if (!practitionerInformation) {
    throw new Error('Practitioner information not found');
  }

  const partiesToWithdrawFromNames: string[] =
    authorizedUser.role === ROLES.irsPractitioner
      ? ['Respondent']
      : (partiesToWithdrawFrom
          .map(userId => {
            const petitioner = petitioners.find(pe => pe.contactId === userId);
            return petitioner ? petitioner.name : null;
          })
          .filter(Boolean) as string[]);

  const generatedPdfPromises: Promise<Uint8Array>[] = [];
  let pdfDoc: PDFDocument;
  try {
    const noticeOfWithdrawalPdf = applicationContext
      .getDocumentGenerators()
      .noticeOfWithdrawal({
        applicationContext,
        data: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
          partiesToWithdrawFrom: partiesToWithdrawFromNames,
          practitionerInformation,
        },
      });
    generatedPdfPromises.push(noticeOfWithdrawalPdf);

    const caseData = await getCaseByDocketNumber({
      docketNumber,
    });

    const paperServicePetitioners = petitioners.filter(
      p =>
        caseData.petitioners.find(
          petitioner => petitioner.contactId === p.contactId,
        )?.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER,
    );

    const certificateOfServicePromises = paperServicePetitioners.map(p => {
      const partyInformation = caseData.petitioners.find(
        petitioner => petitioner.contactId === p.contactId,
      );
      return applicationContext.getDocumentGenerators().certificateOfService({
        applicationContext,
        data: {
          partyInformation,
          practitionerInformation,
          docketNumberWithSuffix,
        },
      });
    });
    generatedPdfPromises.push(...certificateOfServicePromises);

    const generatedPdfs = await Promise.all(generatedPdfPromises);

    const { PDFDocument } = await applicationContext.getPdfLib();
    const loadedPdfs = await Promise.all(
      generatedPdfs.map(pdfBytes => PDFDocument.load(pdfBytes)),
    );

    pdfDoc = await applicationContext
      .getUtilities()
      .combineAllPdfDocuments(applicationContext, loadedPdfs);
  } catch (err) {
    console.error('Error generating PDFs:', err);
    throw err;
  }

  const file = await pdfDoc.save();

  const urlTtl = 60 * 60 * 24;

  return await applicationContext.getUseCaseHelpers().saveFileAndGenerateUrl({
    applicationContext,
    file,
    urlTtl,
    useTempBucket: true,
  });
};
