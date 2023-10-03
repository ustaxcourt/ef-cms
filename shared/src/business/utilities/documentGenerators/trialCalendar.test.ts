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
              inConsolidatedGroup: false,
              petitionerCounsel: ['Ben Matlock', 'Atticus Finch'],
              respondentCounsel: ['Sonny Crockett', 'Ricardo Tubbs'],
            },
            {
              caseTitle: 'Art Garfunkel',
              docketNumber: '234-56',
              docketNumberWithSuffix: '234-56',
              inConsolidatedGroup: true,
              isLeadCase: true,
              leadDocketNumber: '234-56',
              petitionerCounsel: ['Mick Haller'],
              respondentCounsel: ['Joy Falotico'],
            },
            {
              calendarNotes:
                'When you`re down and troubled, And you need a helping hand.',
              caseTitle: 'Lyle Lovett',
              docketNumber: '235-56',
              docketNumberWithSuffix: '235-56',
              inConsolidatedGroup: true,
              isLeadCase: false,
              leadDocketNumber: '234-56',
              petitionerCounsel: ['Alicia Keys', 'James Taylor'],
              respondentCounsel: ['Stevie Nicks'],
            },
            {
              caseTitle: 'Bob Marley',
              docketNumber: '236-56',
              docketNumberWithSuffix: '236-56',
              inConsolidatedGroup: true,
              isLeadCase: false,
              leadDocketNumber: '234-56',
              petitionerCounsel: undefined,
              respondentCounsel: ['Billy Joel'],
            },
            {
              calendarNotes:
                'Tumble out of bed and I stumble to the kitchen, Pour myself a cup of ambition, And yawn and stretch and try to come to life',
              caseTitle: 'Carlos Santana',
              docketNumber: '103-22',
              docketNumberWithSuffix: '103-22L',
              inConsolidatedGroup: false,
              petitionerCounsel: ['Bruce Springsteen', 'Dolly Parton'],
              respondentCounsel: undefined,
            },
            {
              caseTitle: 'Aretha Franklin',
              docketNumber: '110-23',
              docketNumberWithSuffix: '110-23',
              inConsolidatedGroup: false,
              petitionerCounsel: undefined,
              respondentCounsel: undefined,
            },
          ],
          sessionDetail: {
            address1: '123 Some Street',
            address2: 'Suite B',
            courtReporter:
              'Lois Lane\n louise.lesley.lane@super_long_email_should_wrap.gov\n Phone: (123) 456-7890',
            courthouseName: 'Test Courthouse',
            formattedCityStateZip: 'New York, NY 10108',
            irsCalendarAdministrator:
              'Alexandria Ocasio-Cortez\n alexandria.ocasio.cortez@this_email_should_wrap_too.gov \n Phone: (098) 765-4321',
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

  generateAndVerifyPdfDiff({
    fileName: 'Trial_Calendar.pdf',
    pageNumber: 2,
    pdfGenerateFunction: () =>
      trialCalendar({
        applicationContext,
        data: {
          cases: [
            {
              caseTitle: 'Paul Simon',
              docketNumber: '123-45S',
              docketNumberWithSuffix: '123-45S',
              inConsolidatedGroup: false,
              petitionerCounsel: ['Ben Matlock', 'Atticus Finch'],
              respondentCounsel: ['Sonny Crockett', 'Ricardo Tubbs'],
            },
            {
              caseTitle: 'Art Garfunkel',
              docketNumber: '234-56',
              docketNumberWithSuffix: '234-56',
              inConsolidatedGroup: true,
              isLeadCase: true,
              leadDocketNumber: '234-56',
              petitionerCounsel: ['Mick Haller'],
              respondentCounsel: ['Joy Falotico'],
            },
            {
              calendarNotes:
                'When you`re down and troubled, And you need a helping hand.',
              caseTitle: 'Lyle Lovett',
              docketNumber: '235-56',
              docketNumberWithSuffix: '235-56',
              inConsolidatedGroup: true,
              isLeadCase: false,
              leadDocketNumber: '234-56',
              petitionerCounsel: ['Alicia Keys', 'James Taylor'],
              respondentCounsel: ['Stevie Nicks'],
            },
            {
              caseTitle: 'Bob Marley',
              docketNumber: '236-56',
              docketNumberWithSuffix: '236-56',
              inConsolidatedGroup: true,
              isLeadCase: false,
              leadDocketNumber: '234-56',
              petitionerCounsel: undefined,
              respondentCounsel: ['Billy Joel'],
            },
            {
              calendarNotes:
                'Tumble out of bed and I stumble to the kitchen, Pour myself a cup of ambition, And yawn and stretch and try to come to life',
              caseTitle: 'Carlos Santana',
              docketNumber: '103-22',
              docketNumberWithSuffix: '103-22L',
              inConsolidatedGroup: false,
              petitionerCounsel: ['Bruce Springsteen', 'Dolly Parton'],
              respondentCounsel: undefined,
            },
            {
              caseTitle: 'Aretha Franklin',
              docketNumber: '110-23',
              docketNumberWithSuffix: '110-23',
              inConsolidatedGroup: false,
              petitionerCounsel: undefined,
              respondentCounsel: undefined,
            },
            {
              caseTitle: 'Ziggy Marley',
              docketNumber: '110-23',
              docketNumberWithSuffix: '110-23',
              inConsolidatedGroup: true,
              isLeadCase: false,
              petitionerCounsel: undefined,
              respondentCounsel: undefined,
            },
          ],
          sessionDetail: {
            address1: '123 Some Street',
            address2: 'Suite B',
            courtReporter:
              'Lois Lane\n louise.lesley.lane@super_long_email_should_wrap.gov\n Phone: (123) 456-7890',
            courthouseName: 'Test Courthouse',
            formattedCityStateZip: 'New York, NY 10108',
            irsCalendarAdministrator:
              'Alexandria Ocasio-Cortez\n alexandria.ocasio.cortez@this_email_should_wrap_too.gov \n Phone: (098) 765-4321',
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

  generateAndVerifyPdfDiff({
    fileName: 'Trial_Calendar_No_Session_Notes.pdf',
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
            courtReporter:
              'Lois Lane\n louise.lesley.lane@super_long_email_should_wrap.gov\n Phone: (123) 456-7890',
            courthouseName: 'Test Courthouse',
            formattedCityStateZip: 'New York, NY 10108',
            irsCalendarAdministrator:
              'Alexandria Ocasio-Cortez\n alexandria.ocasio.cortez@this_email_should_wrap_too.gov \n Phone: (098) 765-4321',
            judge: 'Joseph Dredd',
            notes: undefined,
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
