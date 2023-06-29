import {
  JURISDICTIONAL_OPTIONS,
  MOTION_DISPOSITIONS,
  PARTY_TYPES,
} from '../../entities/EntityConstants';
import { Stamp } from '../../entities/Stamp';
import { applicationContext } from '../../test/createTestApplicationContext';
import { coverSheet } from './coverSheet';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';

describe('coverSheet', () => {
  generateAndVerifyPdfDiff({
    fileName: 'CoverSheet.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          certificateOfService: true,
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          dateReceived: '01/02/20',
          dateServed: '01/03/20',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
          electronicallyFiled: true,
          index: 10,
        },
      });
    },
    testDescription: 'Generates a CoverSheet document',
  });

  generateAndVerifyPdfDiff({
    fileName: 'CourtIssuedDocumentCoverSheet.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
        },
      });
    },
    testDescription:
      'Generates a CoverSheet document for court issued documents that require a coversheet',
  });

  generateAndVerifyPdfDiff({
    fileName: 'Cover_Sheet_For_Consolidated_Cases.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          consolidatedCases: new Array(38).fill(null).map((v, i) => ({
            docketNumber: `${24929 + i}-17`,
            documentNumber: i + 101,
          })),
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
        },
      });
    },
    testDescription:
      'Generates a CoverSheet document for a docket entry that is part of a consolidated case group',
  });

  const stamp = new Stamp({
    customText: 'Custom stamp data text',
    date: '2022-07-27T04:00:00.000Z',
    deniedAsMoot: true,
    deniedWithoutPrejudice: true,
    disposition: MOTION_DISPOSITIONS.DENIED,
    dueDateMessage: 'The parties shall file a status report by',
    jurisdictionalOption: JURISDICTIONAL_OPTIONS.restoredToDocket,
    nameForSigning: 'Buch',
    nameForSigningLine2: 'Judge',
    strickenFromTrialSession: true,
  });

  generateAndVerifyPdfDiff({
    fileName: 'StampedCoverSheet.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () => {
      return coverSheet({
        applicationContext,
        data: {
          caseCaptionExtension: PARTY_TYPES.petitioner,
          caseTitle: 'Test Person',
          certificateOfService: true,
          dateFiledLodged: '01/01/20',
          dateFiledLodgedLabel: 'Filed',
          dateReceived: '01/02/20',
          dateServed: '01/03/20',
          docketNumberWithSuffix: '123-45S',
          documentTitle: 'Petition',
          electronicallyFiled: true,
          index: 10,
          stamp,
        },
      });
    },
    testDescription: 'Generates a stamped CoverSheet document',
  });
});
