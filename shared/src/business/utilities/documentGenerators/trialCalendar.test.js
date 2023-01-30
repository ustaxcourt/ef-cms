import { applicationContext } from '../../test/createTestApplicationContext';
import { generateAndVerifyPdfDiff } from './generateAndVerifyPdfDiff';
import { trialCalendar } from './trialCalendar';

describe('trialCalendar', () => {
  generateAndVerifyPdfDiff({
    fileName: 'Trial_Calendar.pdf',
    pageNumber: 1,
    pdfGenerateFunction: () =>
      trialCalendar({
        applicationContext,
        data: {
          cases: [
            {
              caseTitle: 'Paul Simon',
              docketNumber: '123-45S',
              docketNumberWithSuffix: '123-45S',
              petitionerCounsel: ['Ben Matlock', 'Atticus Finch'],
              respondentCounsel: ['Sonny Crockett', 'Ricardo Tubbs'],
            },
            {
              caseTitle: 'Art Garfunkel',
              docketNumber: '234-56',
              docketNumberWithSuffix: '234-56',
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
      }),
    testDescription: 'generates a Trial Calendar document',
  });
});
