import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail as formattedCaseDetailComputed } from './formattedCaseDetail';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { mockPetitioners } from './formattedCaseDetail.test';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('getCalendarDetailsForTrialSession', () => {
  let globalUser;
  const { STATUS_TYPES, USER_ROLES } = applicationContext.getConstants();

  const petitionsClerkUser = {
    role: USER_ROLES.petitionsClerk,
    userId: '111',
  };

  const formattedCaseDetail = withAppContextDecorator(
    formattedCaseDetailComputed,
    {
      ...applicationContext,
      getCurrentUser: () => {
        return globalUser;
      },
    },
  );

  const getBaseState = user => {
    globalUser = user;
    return {
      permissions: getUserPermissions(user),
    };
  };

  it('adds the calendarNotes from the trialSession caseOrder if a trialSessionId is set on the case', () => {
    const caseDetail = {
      associatedJudge: 'Judge Judy',
      correspondence: [],
      docketEntries: [],
      docketNumber: '123-45',
      petitioners: mockPetitioners,
      status: STATUS_TYPES.calendared,
      trialDate: '2018-12-11T05:00:00Z',
      trialLocation: 'England is my City',
      trialSessionId: '123',
    };

    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail,
        trialSessions: [
          {
            caseOrder: [
              {
                calendarNotes: 'Test notes',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '123',
          },
        ],
        validationErrors: {},
      },
    });

    expect(result.trialSessionNotes).toEqual('Test notes');
  });

  it('adds calendarNotes and addedToSessionAt fields from trialSessions to case hearings', () => {
    const caseDetail = {
      associatedJudge: 'Judge Judy',
      correspondence: [],
      docketEntries: [],
      docketNumber: '123-45',
      hearings: [
        {
          trialSessionId: '234',
        },
        {
          trialSessionId: '345',
        },
      ],
      petitioners: mockPetitioners,
      status: STATUS_TYPES.calendared,
      trialDate: '2018-12-11T05:00:00Z',
      trialLocation: 'England is my City',
      trialSessionId: '123',
    };

    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail,
        trialSessions: [
          {
            caseOrder: [
              {
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '123',
          },
          {
            caseOrder: [
              {
                addedToSessionAt: '2019-01-01T17:29:13.122Z',
                calendarNotes: 'Hearing notes one.',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '234',
          },
          {
            caseOrder: [
              {
                addedToSessionAt: '2019-01-02T17:29:13.122Z',
                calendarNotes: 'Hearing notes two.',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '345',
          },
        ],
        validationErrors: {},
      },
    });

    expect(result.hearings).toMatchObject([
      {
        addedToSessionAt: '2019-01-01T17:29:13.122Z',
        calendarNotes: 'Hearing notes one.',
        trialSessionId: '234',
      },
      {
        addedToSessionAt: '2019-01-02T17:29:13.122Z',
        calendarNotes: 'Hearing notes two.',
        trialSessionId: '345',
      },
    ]);
  });
});
