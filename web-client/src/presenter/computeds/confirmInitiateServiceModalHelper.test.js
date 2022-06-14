import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { confirmInitiateServiceModalHelper as confirmInitiateServiceModalHelperComputed } from './confirmInitiateServiceModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('confirmInitiateServiceModalHelper', () => {
  // CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES
  const featureFlagHelperState = {
    consolidatedCasesPropagateDocketEntries: true,
  };
  const mockContactId = 'f6847fdb-3669-4ad7-8f82-c4ac3b945523';

  const confirmInitiateServiceModalHelper = withAppContextDecorator(
    confirmInitiateServiceModalHelperComputed,
    applicationContext,
  );

  const FORMATTED_CASE_DETAIL_MULTIPLE_PARTIES = {
    irsPractitioners: [
      {
        name: 'Ms. Respondent Counsel',
        role: ROLES.irsPractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    ],
    isPaper: false,
    petitioners: [
      {
        address1: '609 East Cowley Parkway',
        address2: 'Ullamco quibusdam ea',
        address3: 'Consectetur quos do',
        city: 'asdf',
        contactId: mockContactId,
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'petitioner@example.com',
        name: 'Callie Bullock',
        postalCode: '33333',
        state: 'AK',
      },
      {
        address1: 'asdf',
        city: 'asadf',
        contactType: CONTACT_TYPES.secondary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Chelsea Hogan',
        postalCode: '33333',
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        state: 'AL',
      },
    ],
    privatePractitioners: [
      {
        name: 'Ms. Private Counsel',
        representing: [mockContactId],
        role: ROLES.privatePractitioner,
        serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
      },
    ],
  };

  it('returns the expected contacts needed if someone needs paper without consolidated cases', () => {
    const result = runCompute(confirmInitiateServiceModalHelper, {
      state: {
        featureFlagHelper: featureFlagHelperState,
        form: {},
        formattedCaseDetail: FORMATTED_CASE_DETAIL_MULTIPLE_PARTIES,
        modal: { showModal: 'ConfirmInitiateServiceModal' },
      },
    });

    expect(result).toEqual({
      caseOrGroup: 'case',
      contactsNeedingPaperService: [
        {
          name: 'Ms. Respondent Counsel, Respondent Counsel',
        },
        { name: 'Chelsea Hogan, Petitioner' },
        {
          name: 'Ms. Private Counsel, Petitioner Counsel',
        },
      ],
      showPaperAlert: true,
    });
  });

  it('returns the expected values if no contacts need paper service', () => {
    const result = runCompute(confirmInitiateServiceModalHelper, {
      state: {
        featureFlagHelper: featureFlagHelperState,
        form: {},
        formattedCaseDetail: {
          irsPractitioners: [],
          isPaper: false,
          petitioners: [
            {
              address1: '609 East Cowley Parkway',
              address2: 'Ullamco quibusdam ea',
              address3: 'Consectetur quos do',
              city: 'asdf',
              contactType: CONTACT_TYPES.primary,
              countryType: COUNTRY_TYPES.DOMESTIC,
              email: 'petitioner@example.com',
              name: 'Callie Bullock',
              postalCode: '33333',
              state: 'AK',
            },
          ],
          privatePractitioners: [],
        },
        modal: { showModal: 'ConfirmInitiateServiceModal' },
      },
    });

    expect(result).toEqual({
      caseOrGroup: 'case',
      contactsNeedingPaperService: [],
      showPaperAlert: false,
    });
  });

  describe('should handle consolidated cases', () => {
    const LEAD_CASE = {
      ...MOCK_CASE,
      checkboxDisabled: true,
      checked: true,
      irsPractitioners: [],
      leadDocketNumber: MOCK_CASE.docketNumber,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
      privatePractitioners: [],
    };

    const customizedDocketNumberOne = '1337-42';
    const SECOND_CASE = {
      ...MOCK_CASE,
      checked: true,
      docketNumber: customizedDocketNumberOne,
      irsPractitioners: [],
      leadDocketNumber: MOCK_CASE.docketNumber,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          contactId: "make me unique from the lead case's",
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
      privatePractitioners: [],
    };

    const customizedDocketNumberTwo = '1234-42';
    const THIRD_CASE = {
      ...MOCK_CASE,
      checked: true,
      docketNumber: customizedDocketNumberTwo,
      irsPractitioners: [
        {
          ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.irsPractitioners[0],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
      leadDocketNumber: MOCK_CASE.docketNumber,
      petitioners: [
        {
          ...MOCK_CASE.petitioners[0],
          contactId: 'really, I want this to be unique from the above',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
        {
          ...MOCK_CASE.petitioners[0],
          contactId: 'really!',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE,
        },
      ],
      privatePractitioners: [
        {
          ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0],
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
        },
      ],
    };

    it('should say case if only lead case is checked & have only one contact', () => {
      const nonLeadCase = {
        ...SECOND_CASE,
        checked: false,
      };
      const formattedCaseDetail = {
        consolidatedCases: [LEAD_CASE, nonLeadCase],
        isLeadCase: true,
      };
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          featureFlagHelper: featureFlagHelperState,
          form: { eventCode: 'O' },
          formattedCaseDetail,
          modal: { showModal: 'ConfirmInitiateServiceModal' },
        },
      });

      expect(result.contactsNeedingPaperService.length).toEqual(1);
      expect(result.caseOrGroup).toEqual('case');
      expect(result.showConsolidatedCasesFlag).toEqual(true);
    });

    it('should say group if any non-lead case is checked & have the correct number of contacts', () => {
      const firstNonLeadCase = {
        ...SECOND_CASE,
        checked: false,
      };
      const secondNonLeadCase = {
        ...THIRD_CASE,
      };

      const formattedCaseDetail = {
        consolidatedCases: [LEAD_CASE, firstNonLeadCase, secondNonLeadCase],
        isLeadCase: true,
      };

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          featureFlagHelper: featureFlagHelperState,
          form: { eventCode: 'OSC' },
          formattedCaseDetail,
          modal: { showModal: 'ConfirmInitiateServiceModal' },
        },
      });

      expect(result.contactsNeedingPaperService.length).toEqual(4);
      expect(result.caseOrGroup).toEqual('group');
      expect(result.showConsolidatedCasesFlag).toEqual(true);
    });

    it('should remove duplicated paper contacts', () => {
      const firstNonLeadCase = {
        ...SECOND_CASE,
        checked: false,
        irsPractitioners: [
          {
            ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.irsPractitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        petitioners: [
          {
            ...SECOND_CASE.petitioners[0],
            contactId: LEAD_CASE.petitioners[0].contactId, //have the same contactId as the lead case
          },
        ],
        privatePractitioners: [
          {
            ...MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS.privatePractitioners[0],
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      };
      const secondNonLeadCase = {
        ...THIRD_CASE,
        petitioners: [
          {
            ...THIRD_CASE.petitioners[0],
            contactId: LEAD_CASE.petitioners[0].contactId, //have the same contactId as the lead case
          },
        ],
      };

      const formattedCaseDetail = {
        consolidatedCases: [LEAD_CASE, firstNonLeadCase, secondNonLeadCase],
        isLeadCase: true,
      };

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          featureFlagHelper: featureFlagHelperState,
          form: { eventCode: 'OSC' },
          formattedCaseDetail,
          modal: { showModal: 'ConfirmInitiateServiceModal' },
        },
      });

      expect(result.contactsNeedingPaperService.length).toEqual(3);
    });

    it('should preserve non-consolidated functionality if the CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES is false', () => {
      const formattedCaseDetail = {
        ...LEAD_CASE,
        consolidatedCases: [LEAD_CASE, SECOND_CASE, THIRD_CASE],
        isLeadCase: true,
      };

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          featureFlagHelper: { consolidatedCasesPropagateDocketEntries: false },
          form: { eventCode: 'OSC' },
          formattedCaseDetail,
          modal: { showModal: 'ConfirmInitiateServiceModal' },
        },
      });

      expect(result.contactsNeedingPaperService.length).toEqual(1);
      expect(result.caseOrGroup).toEqual('case');
      expect(result.showConsolidatedCasesFlag).toEqual(false);
    });

    it('should not process consolidated cases when not on confirmInitiateServiceModal', () => {
      const formattedCaseDetail = {
        ...LEAD_CASE,
        consolidatedCases: [LEAD_CASE, SECOND_CASE, THIRD_CASE],
        isLeadCase: true,
      };

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          featureFlagHelper: {
            consolidatedCasesPropagateDocketEntriesFlag: true,
          },
          form: { eventCode: 'OSC' },
          formattedCaseDetail,
          modal: {
            showModal: 'ConfirmInitiateCourtIssuedDocumentServiceModal',
          },
        },
      });

      expect(result.contactsNeedingPaperService.length).toEqual(1);
      expect(result.showConsolidatedCasesFlag).toEqual(false);
    });
  });
});
