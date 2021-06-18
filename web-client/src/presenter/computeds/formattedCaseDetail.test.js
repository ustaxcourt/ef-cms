import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { formattedCaseDetail as formattedCaseDetailComputed } from './formattedCaseDetail';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

const getDateISO = () =>
  applicationContext.getUtilities().createISODateString();

const JUDGES_CHAMBERS = applicationContext
  .getPersistenceGateway()
  .getJudgesChambers();

export const simpleDocketEntries = [
  {
    createdAt: getDateISO(),
    docketEntryId: '123',
    documentTitle: 'Petition',
    filedBy: 'Jessica Frase Marine',
    filingDate: '2019-02-28T21:14:39.488Z',
    isOnDocketRecord: true,
  },
];

export const mockPetitioners = [
  {
    address1: '734 Cowley Parkway',
    address2: 'Cum aut velit volupt',
    address3: 'Et sunt veritatis ei',
    city: 'Et id aut est velit',
    contactId: '0e891509-4e33-49f6-bb2a-23b327faf6f1',
    contactType: CONTACT_TYPES.primary,
    countryType: 'domestic',
    email: 'petitioner@example.com',
    isAddressSealed: false,
    name: 'Mona Schultz',
    phone: '+1 (884) 358-9729',
    postalCode: '77546',
    sealedAndUnavailable: false,
    serviceIndicator: 'Electronic',
    state: 'CT',
  },
];

describe('formattedCaseDetail', () => {
  let globalUser;
  const { STATUS_TYPES, TRIAL_CLERKS_SECTION, USER_ROLES } =
    applicationContext.getConstants();

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

  const petitionsClerkUser = {
    role: USER_ROLES.petitionsClerk,
    userId: '111',
  };
  const docketClerkUser = {
    role: USER_ROLES.docketClerk,
    userId: '222',
  };
  const judgeUser = {
    role: USER_ROLES.judge,
    userId: '444',
  };
  const chambersUser = {
    role: USER_ROLES.chambers,
    section: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
    userId: '555',
  };
  const trialClerkUser = {
    role: USER_ROLES.trialClerk,
    section: TRIAL_CLERKS_SECTION,
    userId: '777',
  };

  it('does not error and returns expected empty values on empty caseDetail', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        ...getBaseState(petitionsClerkUser),
        caseDetail: {
          docketEntries: [],
          petitioners: mockPetitioners,
        },
      },
    });
    expect(result).toMatchObject({});
  });

  describe('case name mapping', () => {
    it('should not error if caseCaption does not exist', () => {
      const caseDetail = {
        ...MOCK_CASE,
        caseCaption: undefined,
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseTitle).toEqual('');
    });

    it("should remove ', Petitioner' from caseCaption", () => {
      const caseDetail = {
        ...MOCK_CASE,
        caseCaption: 'Sisqo, Petitioner',
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseTitle).toEqual('Sisqo');
    });

    it("should remove ', Petitioners' from caseCaption", () => {
      const caseDetail = {
        ...MOCK_CASE,
        caseCaption: 'Sisqo and friends,  Petitioners ',
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseTitle).toEqual('Sisqo and friends');
    });

    it("should remove ', Petitioner(s)' from caseCaption", () => {
      const caseDetail = {
        ...MOCK_CASE,
        caseCaption: "Sisqo's entourage,,    Petitioner(s)    ",
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.caseTitle).toEqual("Sisqo's entourage,");
    });
  });

  describe('practitioner mapping', () => {
    it('should add barNumber into formatted name if available', () => {
      const caseDetail = {
        ...MOCK_CASE,
        privatePractitioners: [
          { barNumber: '9999', name: 'Jackie Chan', representing: [] },
        ],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.privatePractitioners[0].formattedName).toEqual(
        'Jackie Chan (9999)',
      );
    });

    it('should not add barNumber into formatted name if not available', () => {
      const caseDetail = {
        ...MOCK_CASE,
        privatePractitioners: [{ name: 'Jackie Chan', representing: [] }],
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.privatePractitioners[0].formattedName).toEqual(
        'Jackie Chan',
      );
    });
  });

  describe('trial detail mapping mapping', () => {
    it('should format trial information if a trial session id exists', () => {
      const caseDetail = {
        ...MOCK_CASE,
        associatedJudge: 'Judge Judy',
        status: STATUS_TYPES.calendared,
        trialDate: '2018-12-11T05:00:00Z',
        trialLocation: 'England is my City',
        trialSessionId: '123',
        trialTime: '20:30',
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.formattedTrialCity).toEqual('England is my City');
      expect(result.formattedTrialDate).toEqual('12/11/18 08:30 pm');
      expect(result.formattedAssociatedJudge).toEqual('Judge Judy');
    });

    it('should not add time if no time stamp exists', () => {
      const caseDetail = {
        ...MOCK_CASE,
        associatedJudge: 'Judge Judy',
        status: STATUS_TYPES.calendared,
        trialDate: '2018-12-11T05:00:00Z',
        trialLocation: 'England is my City',
        trialSessionId: '123',
      };
      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });
      expect(result.formattedTrialCity).toEqual('England is my City');
      expect(result.formattedTrialDate).toEqual('12/11/18');
      expect(result.formattedAssociatedJudge).toEqual('Judge Judy');
    });
  });

  describe('consolidatedCases', () => {
    it('should format consolidated cases if they exist', () => {
      const caseDetail = {
        ...MOCK_CASE,
        associatedJudge: 'Judge Judy',
        consolidatedCases: [
          {
            associatedJudge: 'Guy Fieri',
            correspondence: [],
            docketEntries: [],
            status: STATUS_TYPES.calendared,
            trialDate: '2018-12-11T05:00:00Z',
            trialLocation: 'Flavortown',
            trialSessionId: '123',
          },
        ],
      };

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.consolidatedCases).toBeDefined();
      expect(result.consolidatedCases.length).toEqual(1);
    });

    it('should default consolidatedCases to an empty array if they do not exist', () => {
      const caseDetail = {
        ...MOCK_CASE,
        consolidatedCases: undefined,
      };

      const result = runCompute(formattedCaseDetail, {
        state: {
          ...getBaseState(petitionsClerkUser),
          caseDetail,
          validationErrors: {},
        },
      });

      expect(result.consolidatedCases).toBeDefined();
      expect(result.consolidatedCases).toEqual([]);
    });
  });

  describe('userIsAssignedToSession', () => {
    it("should be true when the case's trial session judge is the currently logged in user", () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          ...getBaseState(judgeUser),
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeTruthy();
    });

    it("should be false when the case's trial session judge is not the currently logged in user", () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          ...getBaseState(petitionsClerkUser),
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeFalsy();
    });

    it('should be true when the current user is a chambers user for the judge assigned to the trial session the case is scheduled for', () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          judgeUser: {
            section: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
            userId: judgeUser.userId,
          },
          ...getBaseState(chambersUser),
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeTruthy();
    });

    it('should be false when the current user is a chambers user for a different judge than the one assigned to the case', () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          judgeUser: {
            section: JUDGES_CHAMBERS.BUCHS_CHAMBERS_SECTION.section,
            userId: judgeUser.userId,
          },
          ...getBaseState(chambersUser),
          trialSessions: [
            {
              judge: {
                userId: judgeUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeFalsy();
    });

    it('should be true when the current user is the trial clerk assigned to the trial session the case is scheduled for', () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          ...getBaseState(trialClerkUser),
          trialSessions: [
            {
              trialClerk: {
                userId: trialClerkUser.userId,
              },
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeTruthy();
    });

    it('should be false when the current user is a trial clerk and is not assigned to the trial session the case is scheduled for', () => {
      const mockTrialSessionId = applicationContext.getUniqueId();

      const result = runCompute(formattedCaseDetail, {
        state: {
          caseDetail: {
            ...MOCK_CASE,
            trialSessionId: mockTrialSessionId,
          },
          ...getBaseState(trialClerkUser),
          trialSessions: [
            {
              trialClerk: {},
              trialSessionId: mockTrialSessionId,
            },
          ],
        },
      });

      expect(result.userIsAssignedToSession).toBeFalsy();
    });

    describe('hearings - userIsAssignedToSession', () => {
      it("should be true when the hearing's trial session judge is the currently logged in user", () => {
        const mockTrialSessionId = applicationContext.getUniqueId();

        const result = runCompute(formattedCaseDetail, {
          state: {
            caseDetail: {
              ...MOCK_CASE,
              hearings: [
                {
                  judge: {
                    userId: judgeUser.userId,
                  },
                  trialSessionId: '123',
                },
                {
                  judge: {
                    userId: 'some_other_id',
                  },
                  trialSessionId: '234',
                },
              ],
              trialSessionId: mockTrialSessionId,
            },
            ...getBaseState(judgeUser),
            trialSessions: [
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialSessionId: mockTrialSessionId,
              },
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialSessionId: '123',
              },
              {
                judge: {
                  userId: 'some_other_id',
                },
                trialSessionId: '234',
              },
            ],
          },
        });

        expect(result.hearings).toMatchObject([
          {
            judge: {
              userId: judgeUser.userId,
            },
            trialSessionId: '123',
            userIsAssignedToSession: true,
          },
          {
            judge: {
              userId: 'some_other_id',
            },
            trialSessionId: '234',
            userIsAssignedToSession: false,
          },
        ]);
      });

      it('should be true when the current user is a chambers user for the judge assigned to a hearing the case is scheduled for', () => {
        const mockTrialSessionId = applicationContext.getUniqueId();

        const result = runCompute(formattedCaseDetail, {
          state: {
            caseDetail: {
              ...MOCK_CASE,
              hearings: [
                {
                  judge: {
                    userId: judgeUser.userId,
                  },
                  trialSessionId: '123',
                },
                {
                  judge: {
                    userId: 'some_other_id',
                  },
                  trialSessionId: '234',
                },
              ],
            },
            judgeUser: {
              section: JUDGES_CHAMBERS.COLVINS_CHAMBERS_SECTION.section,
              userId: judgeUser.userId,
            },
            ...getBaseState(chambersUser),
            trialSessions: [
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialSessionId: mockTrialSessionId,
              },
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialSessionId: '123',
              },
              {
                judge: {
                  userId: 'some_other_id',
                },
                trialSessionId: '234',
              },
            ],
          },
        });

        expect(result.hearings).toMatchObject([
          {
            judge: {
              userId: judgeUser.userId,
            },
            trialSessionId: '123',
            userIsAssignedToSession: true,
          },
          {
            judge: {
              userId: 'some_other_id',
            },
            trialSessionId: '234',
            userIsAssignedToSession: false,
          },
        ]);
      });

      it('should be true when the current user is the trial clerk assigned to a hearing the case is scheduled for', () => {
        const mockTrialSessionId = applicationContext.getUniqueId();

        const result = runCompute(formattedCaseDetail, {
          state: {
            caseDetail: {
              ...MOCK_CASE,
              hearings: [
                {
                  judge: {
                    userId: judgeUser.userId,
                  },
                  trialClerk: {
                    userId: 'some_other_id',
                  },
                  trialSessionId: '123',
                },
                {
                  judge: {
                    userId: 'some_other_id',
                  },
                  trialClerk: {
                    userId: trialClerkUser.userId,
                  },
                  trialSessionId: '234',
                },
              ],
            },
            ...getBaseState(trialClerkUser),
            trialSessions: [
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialClerk: {
                  userId: trialClerkUser.userId,
                },
                trialSessionId: mockTrialSessionId,
              },
              {
                judge: {
                  userId: judgeUser.userId,
                },
                trialClerk: {
                  userId: 'some_other_id',
                },
                trialSessionId: '123',
              },
              {
                judge: {
                  userId: 'some_other_id',
                },
                trialClerk: {
                  userId: trialClerkUser.userId,
                },
                trialSessionId: '234',
              },
            ],
          },
        });

        expect(result.hearings).toMatchObject([
          {
            judge: {
              userId: judgeUser.userId,
            },
            trialClerk: {
              userId: 'some_other_id',
            },
            trialSessionId: '123',
            userIsAssignedToSession: false,
          },
          {
            judge: {
              userId: 'some_other_id',
            },
            trialClerk: {
              userId: trialClerkUser.userId,
            },
            trialSessionId: '234',
            userIsAssignedToSession: true,
          },
        ]);
      });
    });
  });

  it('should sort hearings by the addedToSessionAt field', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          ...MOCK_CASE,
          docketNumber: '123-45',
          hearings: [
            {
              trialSessionId: '234',
            },
            {
              trialSessionId: '123',
            },
            {
              trialSessionId: '345',
            },
          ],
        },
        ...getBaseState(docketClerkUser),
        trialSessionId: '987',
        trialSessions: [
          {
            caseOrder: [
              {
                addedToSessionAt: '2019-04-19T17:29:13.120Z',
                calendarNotes: 'SECOND',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '234',
          },
          {
            caseOrder: [
              {
                addedToSessionAt: '2018-04-19T17:29:13.120Z',
                calendarNotes: 'FIRST',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '123',
          },
          {
            caseOrder: [
              {
                addedToSessionAt: '2020-04-19T17:29:13.120Z',
                calendarNotes: 'THIRD',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '345',
          },
          {
            caseOrder: [
              {
                addedToSessionAt: '2018-05-19T17:29:13.120Z',
                calendarNotes: 'CASE TRIAL SESSION',
                docketNumber: '123-45',
              },
            ],
            trialSessionId: '987',
          },
        ],
      },
    });

    expect(result.hearings[0]).toMatchObject({
      addedToSessionAt: '2018-04-19T17:29:13.120Z',
      calendarNotes: 'FIRST',
      trialSessionId: '123',
    });

    expect(result.hearings[1]).toMatchObject({
      addedToSessionAt: '2019-04-19T17:29:13.120Z',
      calendarNotes: 'SECOND',
      trialSessionId: '234',
    });

    expect(result.hearings[2]).toMatchObject({
      addedToSessionAt: '2020-04-19T17:29:13.120Z',
      calendarNotes: 'THIRD',
      trialSessionId: '345',
    });
  });

  it('should set contactTypeDisplay on a contact/petitioner', () => {
    const result = runCompute(formattedCaseDetail, {
      state: {
        caseDetail: {
          ...MOCK_CASE,
          petitioners: [
            {
              address1: '123 Testing St',
              city: 'Chicago',
              contactId: '8f21988b-e1c8-413b-a503-e59fd935d481',
              contactType: 'participant',
              countryType: 'domestic',
              entityName: 'Petitioner',
              isAddressSealed: false,
              name: 'John Johnson',
              phone: '5555555555',
              postalCode: '61234',
              sealedAndUnavailable: false,
              serviceIndicator: 'Paper',
              state: 'IL',
            },
          ],
        },
      },
    });

    expect(result.petitioners[0]).toMatchObject({
      displayName: 'John Johnson, Participant',
    });
  });
});
