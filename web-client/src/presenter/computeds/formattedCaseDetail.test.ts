import { CONTACT_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import {
  docketClerkUser,
  petitionsClerkUser,
} from '../../../../shared/src/test/mockUsers';
import { formattedCaseDetail as formattedCaseDetailComputed } from './formattedCaseDetail';
import { getUserPermissions } from '../../../../shared/src/authorization/getUserPermissions';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const getDateISO = () =>
  applicationContext.getUtilities().createISODateString();

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
  const { STATUS_TYPES } = applicationContext.getConstants();

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
