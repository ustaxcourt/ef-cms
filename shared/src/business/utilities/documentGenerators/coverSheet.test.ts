import { MOCK_STAMP } from '@shared/test/mockStamp';
import { PARTY_TYPES } from '../../entities/EntityConstants';
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

  const mockStamp = new Stamp(MOCK_STAMP).validate().toRawObject();

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
          documentTitle:
            'Motion to Consolidate Docket Numbers 25669-16, 25670-16, 25671-16, 25672-16, 22292-17, 22293-17, 22294-17, 22295-17, 19183-18, 19184-18, 19185-18, 19186-18, 19535-19, 19536-19, 21965-19, 21966-19, 13152-20, 13153-20, 13154-20, 13155-20, 31590-21, 31593-21',
          electronicallyFiled: true,
          index: 10,
          stamp: mockStamp,
        },
      });
    },
    testDescription: 'Generates a stamped CoverSheet document',
  });
});
