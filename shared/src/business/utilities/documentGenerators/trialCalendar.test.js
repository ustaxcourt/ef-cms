const fs = require('fs');
const path = require('path');
const sass = require('sass');
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  generatePdfFromHtmlInteractor,
} = require('../../useCases/generatePdfFromHtmlInteractor');
const { getChromiumBrowser } = require('../getChromiumBrowser');
const { trialCalendar } = require('./trialCalendar');

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

      applicationContext.getNodeSass.mockImplementation(() => {
        return sass;
      });

      applicationContext.getPug.mockImplementation(() => {
        return require('pug');
      });

      applicationContext
        .getUseCases()
        .generatePdfFromHtmlInteractor.mockImplementation(
          generatePdfFromHtmlInteractor,
        );
    }
  });

  describe('trialCalendar', () => {
    it('generates a Trial Calendar document', async () => {
      const pdf = await trialCalendar({
        applicationContext,
        data: {
          cases: [
            {
              caseTitle: 'Paul Simon',
              docketNumber: '123-45S',
              petitionerCounsel: ['Ben Matlock', 'Atticus Finch'],
              respondentCounsel: ['Sonny Crockett', 'Ricardo Tubbs'],
            },
            {
              caseTitle: 'Art Garfunkel',
              docketNumber: '234-56',
              petitionerCounsel: ['Mick Haller'],
              respondentCounsel: ['Joy Falotico'],
            },
          ],
          sessionDetail: {
            address1: '123 Some Street',
            address2: 'Suite B',
            courtReporter: 'Lois Lane',
            courthouseName: 'Test Courthouse',
            formattedCityStateZip: 'New York, NY 10108',
            irsCalendarAdministrator: 'iCalRS Admin',
            judge: 'Joseph Dredd',
            notes:
              'The one with the velour shirt is definitely looking at me funny.',
            sessionType: 'Hybrid',
            startDate: 'May 1, 2020',
            startTime: '10:00am',
            trialClerk: 'Clerky McGee',
            trialLocation: 'New York City, New York',
          },
        },
      });

      // Do not write PDF when running on CircleCI
      if (process.env.PDF_OUTPUT) {
        writePdfFile('Trial_Calendar', pdf);
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
