import {
  isAuthorized,
  ROLE_PERMISSIONS,
} from '@shared/authorization/authorizationClientService';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { ROLES } from '@shared/business/entities/EntityConstants';
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
    filers,
    filersMap,
    petitioners,
  }: {
    caseCaptionExtension: string;
    caseTitle: string;
    docketNumber: string;
    docketNumberWithSuffix: string;
    filers: string[];
    filersMap: { [key: string]: boolean };
    petitioners: {
      contactId: string;
      name: string;
    }[];
  },
  authorizedUser: UnknownAuthUser,
): Promise<{ fileId: string; url: string }> => {
  // For now, just check that the user is logged in
  // use isAuthorized to check for type of user
  if (!isAuthorized(authorizedUser, ROLE_PERMISSIONS.FILE_EXTERNAL_DOCUMENT)) {
    throw new UnauthorizedError('Unauthorized');
  }

  const practitionerInformation = await getUserById({
    userId: authorizedUser.userId,
  });

  const filerNames: string[] =
    authorizedUser.role === ROLES.irsPractitioner
      ? ['Respondent']
      : (filers
          .map(filerId => {
            const petitioner = petitioners.find(pe => pe.contactId === filerId);
            return petitioner ? petitioner.name : null;
          })
          .filter(Boolean) as string[]);

  const { PDFDocument } = await applicationContext.getPdfLib();
  const docs: PDFDocument[] = [];
  let pdfDoc;
  try {
    const noticeOfWithdrawalPdf = await applicationContext
      .getDocumentGenerators()
      .noticeOfWithdrawal({
        applicationContext,
        data: {
          caseCaptionExtension,
          caseTitle,
          docketNumberWithSuffix,
          filers: filerNames,
          practitionerInformation,
        },
      });
    const noticeOfWithdrawalPdfDoc = await PDFDocument.load(
      noticeOfWithdrawalPdf,
    );

    docs.push(noticeOfWithdrawalPdfDoc);

    const caseData = await getCaseByDocketNumber({
      docketNumber,
    });

    const petitionersFiledContactId = filers.filter(
      filerId => filersMap[filerId],
    );

    for (const petitionerContactId of petitionersFiledContactId) {
      const partyInformation = caseData.petitioners.find(
        p => p.contactId === petitionerContactId,
      );
      const certificateOfServicePdf = await applicationContext
        .getDocumentGenerators()
        .certificateOfService({
          applicationContext,
          data: {
            partyInformation,
            practitionerInformation,
            docketNumberWithSuffix,
          },
        });
      const certificateOfServicePdfDoc = await PDFDocument.load(
        certificateOfServicePdf,
      );
      docs.push(certificateOfServicePdfDoc);
    }

    // should await all promises in parallel

    pdfDoc = await applicationContext
      .getUtilities()
      .combineAllPdfDocuments(applicationContext, docs);
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
