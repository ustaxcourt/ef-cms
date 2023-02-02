import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../../shared/src/test/mockCase';
import {
  MULTI_DOCKET_FILING_EVENT_CODES,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { confirmInitiateServiceModalHelper as confirmInitiateServiceModalHelperComputed } from './confirmInitiateServiceModalHelper';
import { runCompute } from 'cerebral/test';
import { withAppContextDecorator } from '../../withAppContext';

describe('confirmInitiateServiceModalHelper', () => {
  const mockEventCode = 'OSC';

  const confirmInitiateServiceModalHelper = withAppContextDecorator(
    confirmInitiateServiceModalHelperComputed,
    applicationContext,
  );

  describe('caseOrGroup', () => {
    it('should be "case" when the docket entry is being served a non-consolidated case', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_CASE,
            isLeadCase: false,
          },
          modal: {},
        },
      });

      expect(result.caseOrGroup).toEqual('case');
    });

    it('should be "case" when the docket entry is being served on a consolidated group and only one case in the group is selected for service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: { eventCode: mockEventCode },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
            isLeadCase: true,
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
                },
                {
                  checked: false,
                  docketNumber:
                    MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                },
              ],
            },
          },
        },
      });

      expect(result.caseOrGroup).toEqual('case');
    });

    it('should be "group" when the docket entry is being served on a consolidated group and more than one case in the group is selected for service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: { eventCode: mockEventCode },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
            isLeadCase: true,
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
                },
                {
                  checked: true,
                  docketNumber:
                    MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                },
              ],
            },
          },
        },
      });

      expect(result.caseOrGroup).toEqual('group');
    });
  });

  describe('confirmationText', () => {
    it('should NOT include "selected cases" when the docket entry is NOT being served on a consolidated group', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockEventCode,
          },
          formattedCaseDetail: { ...MOCK_CASE, isLeadCase: false },
          modal: {},
        },
      });

      expect(result.confirmationText).toEqual(
        'The following document will be served on all parties:',
      );
    });

    it('should include "selected cases" when the docket entry is being served on a consolidated group', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
            isLeadCase: true,
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
                },
                {
                  checked: true,
                  docketNumber:
                    MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                },
              ],
            },
          },
        },
      });

      expect(result.confirmationText).toEqual(
        'The following document will be served on all parties in selected cases:',
      );
    });
  });

  describe('contactsNeedingPaperService', () => {
    it('should be an empty list when there aren`t any parties being served that have paper service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_CASE,
            irsPractitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
            ],
            isLeadCase: false,
            petitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE },
            ],
            privatePractitioners: [],
          },
        },
      });

      expect(result.contactsNeedingPaperService).toEqual([]);
    });

    it('should return the list of paper service parties when the docket entry is being served on a non-consolidated case', () => {
      const mockPrivatePractitionerName = 'Attorney McGurney';

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_CASE,
            irsPractitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
            ],
            isLeadCase: false,
            petitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE },
            ],
            privatePractitioners: [
              {
                name: mockPrivatePractitionerName,
                role: ROLES.privatePractitioner,
                serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
              },
            ],
          },
        },
      });

      expect(result.contactsNeedingPaperService).toEqual([
        { name: `${mockPrivatePractitionerName}, Petitioner Counsel` },
      ]);
    });

    it('should return the list of paper service parties when the docket entry is being served on a consolidated group', () => {
      const mockPrivatePractitionerName = 'Attorney McGurney';
      const mockPetitionerName = 'Petitioner Dawn';
      const mockIrsPractitionerName = 'IRS Macbeth';

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [
              {
                ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
                irsPractitioners: [
                  {
                    name: mockIrsPractitionerName,
                    role: ROLES.irsPractitioner,
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
                  },
                ],
                petitioners: [
                  {
                    contactType: ROLES.petitioner,
                    name: mockPetitionerName,
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
                  },
                ],
                privatePractitioners: [],
              },
            ],
            irsPractitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
            ],
            isLeadCase: true,
            petitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE },
            ],
            privatePractitioners: [
              {
                name: mockPrivatePractitionerName,
                role: ROLES.privatePractitioner,
                serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
              },
            ],
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                {
                  checked: true,
                  docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
                },
                {
                  checked: true,
                  docketNumber:
                    MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                },
              ],
            },
          },
        },
      });

      expect(result.contactsNeedingPaperService).toEqual([
        { name: `${mockIrsPractitionerName}, Respondent Counsel` },
        { name: `${mockPetitionerName}, Petitioner` },
        { name: `${mockPrivatePractitionerName}, Petitioner Counsel` },
      ]);
    });
  });

  describe('showConsolidatedCasesForService', () => {
    it('should be false when the docket entry is being filed on a consolidated case that is NOT the  lead case', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
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
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the the docket entry is NOT a document type that can be multi-docketed', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            form: {
              eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              irsPractitioners: [],
              isLeadCase: true,
              petitioners: [],
              privatePractitioners: [],
            },
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the docket entry is being served from a message', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
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
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the docket entry is a paper filing and the feature flag is off', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            currentPage: 'CaseDetail',
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: false,
            },
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
              isLeadCase: true,
            },
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be true when the docket entry is being filed on a lead case, and the docket entry is a document type that can be multi-docketed', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            featureFlagHelper: {
              areMultiDocketablePaperFilingsEnabled: true,
            },
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
              consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
              isLeadCase: true,
            },
            modal: {
              form: {
                consolidatedCasesToMultiDocketOn: [
                  {
                    checked: true,
                    docketNumber:
                      MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                  },
                  {
                    checked: true,
                    docketNumber:
                      MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                  },
                ],
              },
            },
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(true);
    });
  });

  describe('showPaperAlert', () => {
    it('should be true when there is at least one party being served that has paper service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_CASE,
            petitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER },
            ],
          },
          modal: {},
        },
      });

      expect(result.showPaperAlert).toEqual(true);
    });

    it('should be false when none of the parties being served have paper service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_CASE,
            petitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
            ],
          },
          modal: {},
        },
      });

      expect(result.showPaperAlert).toEqual(false);
    });
  });
});
