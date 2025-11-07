import { NewMinuteSheetKysely } from '@web-api/persistence/postgres/minuteSheets/schema';

export const minuteSheets: NewMinuteSheetKysely[] = [
  {
    trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    docketNumber: '103-20',
    content: {
      trialSession: {
        id: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
        judge: {
          fullName: 'John O. Colvin',
          title: 'Judge',
          userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
        },
        trialClerk: 'Test Trial Clerk',
        courtReporter: 'Test Reporter',
        isRemote: false,
      },
      caseRecord: {
        docketNumber: '103-20',
        calendarCall: { date: '', note: '', transcriptOrdered: false },
        notCalled: { date: '', note: '' },
        recalls: [{ date: '', note: '', transcriptOrdered: false }],
        pretrialConference: { date: '', note: '', transcriptOrdered: false },
        trial: {
          date: '',
          note: '',
          trialHearingType: '',
          transcriptOrdered: false,
        },
        hearing: {
          date: '',
          note: '',
          trialHearingType: '',
          transcriptOrdered: false,
        },
      },
      appearances: {
        petitioners: {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '',
              name: 'Test Private Practitioner',
              role: 'counsel',
              note: '',
            },
          ],
        },
        respondents: [
          { datesOfAppearance: '', name: '', role: 'counsel', note: '' },
        ],
      },
      jurisdiction: {
        retained: { date: '', note: '' },
        continued: { date: '', note: '' },
      },
      orders: {
        statusReport: { date: '', dueDate: '', note: '', orderedFor: '' },
        stipulatedDecision: { date: '', dueDate: '', note: '' },
      },
      proceedings: {
        motions: [
          {
            date: '',
            filedBy: 'petitioner',
            note: '',
            objection: 'unknown',
            oralMotion: false,
            status: 'filed',
            type: 'motionForContinuance',
          },
        ],
        actionsAndFilings: [
          {
            date: '',
            documentType: '',
            filedBy: '',
            note: '',
            objection: '',
            oralMotion: false,
            status: '',
            isOnDocketRecord: false,
          },
        ],
      },
      brief: { type: '', details: {}, transcriptOrdered: false, note: '' },
      evidence: {
        petitionerWitnesses: [{ name: '' }],
        respondentWitnesses: [{ name: '' }],
        exhibits: [{ description: '', note: '', status: 'admitted' }],
      },
    },
  },
  {
    trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    docketNumber: '101-20',
    content: {
      trialSession: {
        id: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
        judge: {
          fullName: 'John O. Colvin',
          title: 'Judge',
          userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
        },
        trialClerk: 'Test Trial Clerk',
        courtReporter: 'Test Reporter',
        isRemote: false,
      },
      caseRecord: {
        docketNumber: '101-20',
        calendarCall: { date: '', note: '', transcriptOrdered: false },
        notCalled: { date: '', note: '' },
        recalls: [{ date: '', note: '', transcriptOrdered: false }],
        pretrialConference: { date: '', note: '', transcriptOrdered: false },
        trial: {
          date: '',
          note: '',
          trialHearingType: '',
          transcriptOrdered: false,
        },
        hearing: {
          date: '',
          note: '',
          trialHearingType: '',
          transcriptOrdered: false,
        },
      },
      appearances: {
        petitioners: {
          noAppearance: false,
          appearances: [
            {
              datesOfAppearance: '',
              name: 'Test Private Practitioner',
              role: 'counsel',
              note: '',
            },
          ],
        },
        respondents: [
          { datesOfAppearance: '', name: '', role: 'counsel', note: '' },
        ],
      },
      jurisdiction: {
        retained: { date: '', note: '' },
        continued: { date: '', note: '' },
      },
      orders: {
        statusReport: { date: '', dueDate: '', note: '', orderedFor: '' },
        stipulatedDecision: { date: '', dueDate: '', note: '' },
      },
      proceedings: {
        motions: [
          {
            date: '',
            filedBy: 'petitioner',
            note: '',
            objection: 'unknown',
            oralMotion: false,
            status: 'filed',
            type: 'motionForContinuance',
          },
        ],
        actionsAndFilings: [
          {
            date: '',
            documentType: '',
            filedBy: '',
            note: '',
            objection: '',
            oralMotion: false,
            status: '',
            isOnDocketRecord: false,
          },
        ],
      },
      brief: { type: '', details: {}, transcriptOrdered: false, note: '' },
      evidence: {
        petitionerWitnesses: [{ name: '' }],
        respondentWitnesses: [{ name: '' }],
        exhibits: [{ description: '', note: '', status: 'admitted' }],
      },
    },
  },
];
