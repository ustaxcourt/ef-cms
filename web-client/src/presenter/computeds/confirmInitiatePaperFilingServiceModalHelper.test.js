import {
  CONTACT_TYPES,
  COUNTRY_TYPES,
  MULTI_DOCKET_FILING_EVENT_CODES,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_ELIGIBLE_CASE_WITH_PRACTITIONERS,
} from '../../../../shared/src/test/mockCase';
import { applicationContext } from '../../applicationContext';
import { confirmInitiatePaperFilingServiceModalHelper as confirmInitiatePaperFilingServiceModalHelperComputed } from './confirmInitiatePaperFilingServiceModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('confirmInitiatePaperFilingServiceModalHelper', () => {
  const mockContactId = 'f6847fdb-3669-4ad7-8f82-c4ac3b945523';
  const mockEventCode = 'OSC';

  const confirmInitiatePaperFilingServiceModalHelper = withAppContextDecorator(
    confirmInitiatePaperFilingServiceModalHelperComputed,
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
    const result = runCompute(confirmInitiatePaperFilingServiceModalHelper, {
      state: {
        featureFlagHelper: {
          areMultiDocketablePaperFilingsEnabled: false,
        },
        form: {
          eventCode: mockEventCode,
        },
        formattedCaseDetail: FORMATTED_CASE_DETAIL_MULTIPLE_PARTIES,
        modal: { showModal: 'ConfirmInitiateServiceModal' },
      },
    });

    expect(result).toMatchObject({
      caseOrGroup: 'case',
      confirmationText: 'The following document will be served on all parties:',
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
    const result = runCompute(confirmInitiatePaperFilingServiceModalHelper, {
      state: {
        featureFlagHelper: {
          areMultiDocketablePaperFilingsEnabled: false,
        },
        form: {
          eventCode: mockEventCode,
        },
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

    expect(result).toMatchObject({
      caseOrGroup: 'case',
      confirmationText: 'The following document will be served on all parties:',
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
        irsPractitioners: [],
        isLeadCase: true,
        petitioners: [
          {
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
        privatePractitioners: [],
      };

      const result = runCompute(confirmInitiatePaperFilingServiceModalHelper, {
        state: {
          featureFlagHelper: {
            areMultiDocketablePaperFilingsEnabled: true,
          },
          form: { eventCode: 'O' },
          formattedCaseDetail,
          modal: { showModal: 'ConfirmInitiateServiceModal' },
        },
      });

      expect(result.contactsNeedingPaperService.length).toEqual(1);
      expect(result.caseOrGroup).toEqual('case');
      expect(result.confirmationText).toEqual(
        'The following document will be served on all parties in selected cases:',
      );
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

      const result = runCompute(confirmInitiatePaperFilingServiceModalHelper, {
        state: {
          featureFlagHelper: {
            areMultiDocketablePaperFilingsEnabled: true,
          },
          form: { eventCode: 'OSC' },
          formattedCaseDetail,
          modal: { showModal: 'ConfirmInitiateServiceModal' },
        },
      });

      expect(result.contactsNeedingPaperService.length).toEqual(4);
      expect(result.caseOrGroup).toEqual('group');
      expect(result.confirmationText).toEqual(
        'The following document will be served on all parties in selected cases:',
      );
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

      const result = runCompute(confirmInitiatePaperFilingServiceModalHelper, {
        state: {
          featureFlagHelper: {
            areMultiDocketablePaperFilingsEnabled: true,
          },
          form: { eventCode: 'OSC' },
          formattedCaseDetail,
          modal: {
            showModal: 'ConfirmInitiateCourtIssuedFilingServiceModal',
          },
        },
      });

      expect(result.contactsNeedingPaperService.length).toEqual(3);
    });
  });

  describe('showConsolidatedCasesForService', () => {
    it('should be false when the docket entry is being edited', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiatePaperFilingServiceModalHelper,
        {
          state: {
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: true,
            },
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              irsPractitioners: [],
              isLeadCase: true,
              petitioners: [],
              privatePractitioners: [],
            },
            isEditingDocketEntry: true,
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when MULTI_DOCKETABLE_PAPER_FILINGS feature flag is false', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiatePaperFilingServiceModalHelper,
        {
          state: {
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: false,
            },
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              irsPractitioners: [],
              isLeadCase: true,
              petitioners: [],
              privatePractitioners: [],
            },
            isEditingDocketEntry: false,
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the case the docket entry is being filed on is NOT a lead case', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiatePaperFilingServiceModalHelper,
        {
          state: {
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: true,
            },
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              irsPractitioners: [],
              isLeadCase: false,
              petitioners: [],
              privatePractitioners: [],
            },
            isEditingDocketEntry: false,
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the docket entry is NOT a document type that can be multi-docketed', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiatePaperFilingServiceModalHelper,
        {
          state: {
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: true,
            },
            form: {
              eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              irsPractitioners: [],
              isLeadCase: true,
              petitioners: [],
              privatePractitioners: [],
            },
            isEditingDocketEntry: false,
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the docket entry is being served from a message', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiatePaperFilingServiceModalHelper,
        {
          state: {
            currentPage: 'MessageDetail',
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: true,
            },
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              irsPractitioners: [],
              isLeadCase: true,
              petitioners: [],
              privatePractitioners: [],
            },
            isEditingDocketEntry: false,
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the docket entry is being served from the document viewer and is not multi docketable', () => {
      const mockDocketEntryId = '123';

      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiatePaperFilingServiceModalHelper,
        {
          state: {
            currentPage: 'DocumentViewer',
            docketEntryId: mockDocketEntryId,
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: true,
            },
            form: {
              eventCode: undefined,
            },
            formattedCaseDetail: {
              docketEntries: [
                {
                  docketEntryId: mockDocketEntryId,
                  eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES[0],
                },
              ],
              irsPractitioners: [],
              isLeadCase: true,
              petitioners: [],
              privatePractitioners: [],
            },
            isEditingDocketEntry: false,
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be true when the docket entry is NOT being edited, the MULTI_DOCKETABLE_PAPER_FILINGS feature flag is true, the docket entry is being filed on a lead case, the docket entry is a document type that can be multi-docketed, and the docket entry is NOT being served from a message', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiatePaperFilingServiceModalHelper,
        {
          state: {
            currentPage: 'CaseDetail',
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: true,
            },
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              consolidatedCases: [],
              irsPractitioners: [],
              isLeadCase: true,
              petitioners: [],
              privatePractitioners: [],
            },
            isEditingDocketEntry: false,
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(true);
    });
  });
});
