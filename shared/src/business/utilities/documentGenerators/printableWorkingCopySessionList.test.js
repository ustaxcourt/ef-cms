import {
  FORMATTED_CASES,
  FORMATTED_TRIAL_SESSION,
  SESSION_NOTES,
} from './constants/printableTrialSessionWorkingCopyConstants';
import { applicationContext } from '../../test/createTestApplicationContext';
import { generatePdfFromHtmlInteractor } from '../../useCases/generatePdfFromHtmlInteractor';
import { getChromiumBrowser } from '../getChromiumBrowser';
import { printableWorkingCopySessionList } from './printableWorkingCopySessionList';
import fs from 'fs';
import path from 'path';

describe('documentGenerators', () => {
  const testOutputPath = path.resolve(
    __dirname,
    '../../../../test-output/document-generation',
  );

  const writePdfFile = (name, data) => {
    const pdfPath = `${testOutputPath}/${name}.pdf`;
    fs.writeFileSync(pdfPath, data);
  };

  beforeAll(() => {
    if (process.env.PDF_OUTPUT) {
      fs.mkdirSync(testOutputPath, { recursive: true }, err => {
        if (err) throw err;
      });

      applicationContext.getChromiumBrowser.mockImplementation(
        getChromiumBrowser,
      );

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('printableWorkingCopySessionList', () => {
    it('generates a Trial Session Working Copy document with case notes', async () => {
      const pdf = await printableWorkingCopySessionList({
        applicationContext,
        data: {
          filters: {
            aBasisReached: true,
            continued: true,
            dismissed: true,
            recall: true,
            rule122: true,
            setForTrial: true,
            settled: true,
            showAll: true,
            statusUnassigned: true,
            takenUnderAdvisement: true,
          },
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: FORMATTED_TRIAL_SESSION,
          sessionNotes: SESSION_NOTES,
          showCaseNotes: true,
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile(
          'Printable_Trial_Session_Working_Copy_With_Case_Notes',
          pdf,
        );
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
        const { PDFDocument } = await applicationContext.getPdfLib();
        await PDFDocument.load(new Uint8Array(pdf));
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });

    it('generates a Trial Session Working Copy document without case notes', async () => {
      const pdf = await printableWorkingCopySessionList({
        applicationContext,
        data: {
          filters: {
            aBasisReached: true,
            continued: false,
            dismissed: true,
            recall: true,
            rule122: false,
            setForTrial: true,
            settled: true,
            showAll: false,
            statusUnassigned: true,
            takenUnderAdvisement: false,
          },
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: FORMATTED_TRIAL_SESSION,
          sessionNotes: SESSION_NOTES,
          showCaseNotes: false,
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile(
          'Printable_Trial_Session_Working_Copy_Without_Case_Notes',
          pdf,
        );
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
        const { PDFDocument } = await applicationContext.getPdfLib();
        await PDFDocument.load(new Uint8Array(pdf));
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
