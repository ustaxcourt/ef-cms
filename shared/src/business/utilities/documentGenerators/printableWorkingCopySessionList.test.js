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
    it('generates a Trial Session Working Copy document', async () => {
      const pdf = await printableWorkingCopySessionList({
        applicationContext,
        data: {
          caseNotesFlag: true,
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
          formattedCases: [
            {
              docketNumber: '189-22',
              irsPractitioners: [],
              privatePractitioners: [],
            },
            {
              docketNumber: '190-22',
              irsPractitioners: [],
              privatePractitioners: [],
            },
          ],
          formattedTrialSession: {},
          sessionNotes: 'session notes',
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Printable_Working_Copy_Session_List', pdf);
        expect(applicationContext.getChromiumBrowser).toHaveBeenCalled();
      }

      expect(
        applicationContext.getUseCases().generatePdfFromHtmlInteractor,
      ).toHaveBeenCalled();
      expect(applicationContext.getNodeSass).toHaveBeenCalled();
      expect(applicationContext.getPug).toHaveBeenCalled();
    });
  });
});
