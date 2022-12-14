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
          filters: [
            { key: 'setForTrial', label: 'Set For Trial' },
            { key: 'dismissed', label: 'Dismissed' },
            { key: 'continued', label: 'Continued' },
            { key: 'rule122', label: 'Rule 122' },
            { key: 'basisReached', label: 'Basis Reached' },
            { key: 'settled', label: 'Settled' },
            { key: 'recall', label: 'Recall' },
            { key: 'submittedCAV', label: 'Submitted/CAV' },
            { key: 'statusUnassigned', label: 'Unassigned' },
          ],
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: FORMATTED_TRIAL_SESSION,
          sessionNotes: SESSION_NOTES,
          showCaseNotes: true,
          sort: 'docket',
          userHeading: 'Gustafson - Session Copy',
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
          filters: [
            { key: 'setForTrial', label: 'Set For Trial' },
            { key: 'dismissed', label: 'Dismissed' },
            { key: 'continued', label: 'Continued' },
            { key: 'basisReached', label: 'Basis Reached' },
            { key: 'settled', label: 'Settled' },
            { key: 'recall', label: 'Recall' },
            { key: 'statusUnassigned', label: 'Unassigned' },
          ],
          formattedCases: FORMATTED_CASES,
          formattedTrialSession: FORMATTED_TRIAL_SESSION,
          sessionNotes: SESSION_NOTES,
          showCaseNotes: false,
          sort: 'docket',
          userHeading: 'Gustafson - Session Copy',
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
