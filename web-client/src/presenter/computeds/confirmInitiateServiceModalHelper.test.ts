import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '@shared/test/mockCase';
import {
  MULTI_DOCKET_FILING_EVENT_CODES,
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@web-client/applicationContext';
import { cloneDeep } from 'lodash';
import { confirmInitiateServiceModalHelper as confirmInitiateServiceModalHelperComputed } from './confirmInitiateServiceModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import { MOCK_CONSOLIDATED_CASE } from '@shared/test/mockConsolidatedCase';

describe('confirmInitiateServiceModalHelper', () => {
  const mockNonMultiDocketableEventCode = 'ODJ';
  const mockMultiDocketableEventCode = 'MOTN';

  const confirmInitiateServiceModalHelper = withAppContextDecorator(
    confirmInitiateServiceModalHelperComputed,
    applicationContext,
  );

  describe('caseOrGroup', () => {
    it('should populate the paperFilingText with the correct text when a document cannot be filed across a group', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockNonMultiDocketableEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_CASE,
            isLeadCase: false,
          },
          modal: {},
        },
      });

      expect(result.paperFilingText).toEqual(
        'This case has parties receiving paper service:',
      );
    });

    it('should populate the paperFilingText with the correct text when a document can be filed across a group', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockMultiDocketableEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_CONSOLIDATED_CASE,
            isLeadCase: true,
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [
                { docketNumber: '103-67', checked: true },
              ],
            },
          },
        },
      });

      expect(result.paperFilingText).toEqual(
        'Paper service is required for these parties:',
      );
    });
  });

  describe('confirmationText', () => {
    it('should NOT include "selected cases" when the docket entry cannot be filed across a group', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockNonMultiDocketableEventCode,
          },
          formattedCaseDetail: {
            ...MOCK_CASE,
            isLeadCase: false,
          },
          modal: {},
        },
      });

      expect(result.confirmationText).toEqual(
        'The following document will be served on all parties:',
      );
    });

    it('should include "selected cases" when the docket entry can be served across a consolidated group', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockMultiDocketableEventCode,
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
    it('should be undefined when no parties have paper service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockNonMultiDocketableEventCode,
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

      expect(result.contactsNeedingPaperService).not.toBeDefined();
    });

    it('should list paper service parties with correct docket number and role labels', () => {
      const mockPrivatePractitionerName = 'Attorney McGurney';

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES,
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
        {
          name: mockPrivatePractitionerName,
          formattedContactType: 'Petitioner Counsel',
          docketNumber: MOCK_CASE.docketNumber,
        },
      ]);
    });

    it('should return paper service parties from consolidated group', () => {
      const mockPrivatePractitionerName = 'Attorney McGurney';
      const mockIrsPractitionerName = 'IRS Macbeth';

      const mockLeadCase = {
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        irsPractitioners: [
          {
            name: mockIrsPractitionerName,
            role: ROLES.irsPractitioner,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            userId: '3dfe8d03-0034-4e38-9f8f-67b478430330',
          },
        ],
        isLeadCase: true,
        petitioners: [],
        privatePractitioners: [
          {
            name: mockPrivatePractitionerName,
            role: ROLES.privatePractitioner,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            userId: '63356468-ed6a-47e8-8fac-07c7ab750dfa',
          },
        ],
      };

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockMultiDocketableEventCode,
          },
          formattedCaseDetail: {
            ...mockLeadCase,
            consolidatedCases: [
              mockLeadCase,
              {
                ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
                irsPractitioners: [
                  {
                    name: mockIrsPractitionerName,
                    role: ROLES.irsPractitioner,
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
                    userId: '3dfe8d03-0034-4e38-9f8f-67b478430330',
                  },
                ],
                petitioners: [],
                privatePractitioners: [],
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
        {
          docketNumber: '109-19',
          formattedContactType: 'Respondent Counsel',
          name: 'IRS Macbeth',
        },
        {
          docketNumber: '109-19',
          formattedContactType: 'Petitioner Counsel',
          name: 'Attorney McGurney',
        },
        {
          docketNumber: '110-19',
          formattedContactType: 'Respondent Counsel',
          name: 'IRS Macbeth',
        },
      ]);
    });
  });

  describe('canFileAcrossGroup', () => {
    let baseState;

    beforeEach(() => {
      baseState = cloneDeep({
        form: {
          documentTitle: 'Answer',
          eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
        },
        formattedCaseDetail: MOCK_CASE,
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn: [],
          },
        },
      });
    });

    it('should be false when the case is not a lead case', () => {
      const { canFileAcrossGroup } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            formattedCaseDetail: {
              ...MOCK_CONSOLIDATED_CASE,
              docketNumber:
                MOCK_CONSOLIDATED_CASE.consolidatedCases[1].docketNumber,
            },
          },
        },
      );

      expect(canFileAcrossGroup).toEqual(false);
    });

    it('should be false when the document type cannot be multi-docketed', () => {
      const { canFileAcrossGroup } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            form: {
              eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES[0],
            },
            formattedCaseDetail: MOCK_CONSOLIDATED_CASE,
          },
        },
      );

      expect(canFileAcrossGroup).toEqual(false);
    });

    it('should be true for lead case with multi-docketable document type', () => {
      const { canFileAcrossGroup } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: MOCK_CONSOLIDATED_CASE,
          },
        },
      );

      expect(canFileAcrossGroup).toEqual(true);
    });
  });

  describe('canServeAcrossGroup', () => {
    let baseState;

    beforeEach(() => {
      baseState = cloneDeep({
        form: {
          documentTitle: 'Answer',
          eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
        },
        formattedCaseDetail: MOCK_CASE,
        modal: {
          form: {
            consolidatedCasesToMultiDocketOn: [],
          },
        },
      });
    });

    it('should be true for lead case with multi-docketable document type', () => {
      const { canServeAcrossGroup } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            form: {
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: MOCK_CONSOLIDATED_CASE,
          },
        },
      );

      expect(canServeAcrossGroup).toEqual(true);
    });

    it('should be true if document has been filed across a group', () => {
      const { canServeAcrossGroup } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            form: {
              eventCode: mockMultiDocketableEventCode,
              isFiledAcrossAllCases: true,
            },
            formattedCaseDetail: {
              ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
              consolidatedCases: [
                {
                  ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
                  caseTitle: 'Same case',
                },
                {
                  ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
                  caseTitle: 'Different case',
                },
              ],
            },

            modal: {},
          },
        },
      );

      expect(canServeAcrossGroup).toEqual(true);
    });
  });

  describe('additionalServedCases', () => {
    it('should be empty when hasFiledAcrossGroup is false', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
          },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
          },
          modal: {
            form: {
              consolidatedCasesToMultiDocketOn: [],
            },
          },
        },
      });

      expect(result.additionalServedCases).toEqual([]);
    });

    it('should include consolidated cases if hasFiledAcrossGroup is true on form', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: mockMultiDocketableEventCode,
            isFiledAcrossAllCases: true,
          },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [
              {
                ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Same case',
              },
              {
                ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Different case',
              },
            ],
          },

          modal: {},
        },
      });

      expect(result.additionalServedCases).toEqual([
        {
          docketNumber:
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          caseTitle: 'Different case',
        },
      ]);
    });

    it('should include consolidated cases if hasFiledAcrossGroup is true on currentDocketEntry', () => {
      const mockDocketEntryId = '78ef43a5-b29b-4ab6-9924-545598fd1d63';
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          docketEntryId: mockDocketEntryId,
          form: {},
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            docketEntries: [
              ...MOCK_CONSOLIDATED_CASE.docketEntries,
              {
                ...MOCK_CONSOLIDATED_CASE.docketEntries[4],
                docketEntryId: mockDocketEntryId,
                isFiledAcrossAllCases: true,
              },
            ],
            consolidatedCases: [
              {
                ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Same case',
              },
              {
                ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Different case',
              },
            ],
          },
          modal: {},
        },
      });

      expect(result.additionalServedCases).toEqual([
        {
          docketNumber:
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          caseTitle: 'Different case',
        },
      ]);
    });
  });
});
