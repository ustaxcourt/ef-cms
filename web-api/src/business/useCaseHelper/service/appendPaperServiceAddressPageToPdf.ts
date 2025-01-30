import { Case } from '@shared/business/entities/cases/Case';
import { ServerApplicationContext } from '@web-api/applicationContext';
import { PDFDocument } from 'pdf-lib';

type AppendPaperServiceAddressPageToPdfParams = {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  newPdfDoc: PDFDocument;
  noticeDoc: PDFDocument;
  servedParties: {
    all: any[];
    paper: any[];
    electronic: Array<{ email: string; name: string }>;
  };
};

export async function appendPaperServiceAddressPageToPdf({
  applicationContext,
  caseEntity,
  newPdfDoc,
  noticeDoc,
  servedParties,
}: AppendPaperServiceAddressPageToPdfParams) {
  const addressPages = await getAddressPages({
    applicationContext,
    caseEntity,
    servedParties,
  });

  await copyToNewPdf({
    addressPages,
    applicationContext,
    newPdfDoc,
    noticeDoc,
  });
}

type GetAddressPagesParams = {
  applicationContext: ServerApplicationContext;
  caseEntity: Case;
  servedParties: {
    all: any[];
    paper: any[];
    electronic: Array<{ email: string; name: string }>;
  };
};

async function getAddressPages({
  applicationContext,
  caseEntity,
  servedParties,
}: GetAddressPagesParams) {
  const addressPages: Uint8Array<ArrayBufferLike>[] = [];
  for (const party of servedParties.paper) {
    addressPages.push(
      await applicationContext.getDocumentGenerators().addressLabelCoverSheet({
        applicationContext,
        data: {
          ...party,
          docketNumberWithSuffix: caseEntity.docketNumberWithSuffix,
        },
      }),
    );
  }
  return addressPages;
}

type CopyToNewPdfParams = {
  applicationContext: ServerApplicationContext;
  addressPages: Uint8Array<ArrayBufferLike>[];
  newPdfDoc: PDFDocument;
  noticeDoc: PDFDocument;
};

async function copyToNewPdf({
  addressPages,
  applicationContext,
  newPdfDoc,
  noticeDoc,
}: CopyToNewPdfParams) {
  const { PDFDocument } = await applicationContext.getPdfLib();

  for (const addressPage of addressPages) {
    const addressPageDoc = await PDFDocument.load(addressPage);
    let copiedPages = await newPdfDoc.copyPages(
      addressPageDoc,
      addressPageDoc.getPageIndices(),
    );
    copiedPages.forEach(page => {
      newPdfDoc.addPage(page);
    });

    copiedPages = await newPdfDoc.copyPages(
      noticeDoc,
      noticeDoc.getPageIndices(),
    );
    copiedPages.forEach(page => {
      newPdfDoc.addPage(page);
    });
  }
}
