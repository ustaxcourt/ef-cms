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

    it('should return unique paper service parties from consolidated group', () => {
      const mockPrivatePractitionerName = 'Attorney McGurney';
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
                    userId: '3dfe8d03-0034-4e38-9f8f-67b478430330',
                  },
                ],
                petitioners: [],
                privatePractitioners: [],
              },
            ],
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

      expect(result.contactsNeedingPaperService).toHaveLength(2);
      expect(result.contactsNeedingPaperService).toEqual(
        expect.arrayContaining([
          { name: `${mockPrivatePractitionerName}, Petitioner Counsel` },
          { name: `${mockIrsPractitionerName}, Respondent Counsel` },
        ]),
      );
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
              isLeadCase: false,
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
            formattedCaseDetail: {
              isLeadCase: true,
            },
          },
        },
      );

      expect(canFileAcrossGroup).toEqual(false);
    });

    it('should be false when serving from a message detail page', () => {
      const { canFileAcrossGroup } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            currentPage: 'MessageDetail',
            formattedCaseDetail: {
              isLeadCase: true,
            },
          },
        },
      );

      expect(canFileAcrossGroup).toEqual(false);
    });

    it('should be false for non-court-issued simultaneous documents', () => {
      const { canFileAcrossGroup } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            form: {
              eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              isLeadCase: true,
            },
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
            formattedCaseDetail: {
              isLeadCase: true,
            },
          },
        },
      );

      expect(canFileAcrossGroup).toEqual(true);
    });
  });

  describe('showPaperAlert', () => {
    let baseState;
    beforeEach(() => {
      baseState = cloneDeep({
        form: {
          eventCode: mockEventCode,
        },
        formattedCaseDetail: {
          ...MOCK_CASE,
          petitioners: [],
        },
        modal: {},
      });
    });

    it('should be true when there is at least one party being served that has paper service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            petitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER },
            ],
          },
        },
      });

      expect(result.contactsNeedingPaperService).toBeDefined();
    });

    it('should be false when none of the parties being served have paper service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            petitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
            ],
          },
        },
      });

      expect(result.contactsNeedingPaperService).toBeUndefined();
    });
  });

  describe('additionalServedCases', () => {
    it('should be empty when the document is not a simultaneous document', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: 'ANSWER',
          },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
            isLeadCase: true,
          },
          modal: {},
        },
      });

      expect(result.additionalServedCases).toEqual([]);
    });

    it('should be empty when isFiledAcrossAllCases is false', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
          },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
            isLeadCase: true,
          },
          isFiledAcrossAllCases: false,
          modal: {},
        },
      });

      expect(result.additionalServedCases).toEqual([]);
    });

    it('should include consolidated cases for simultaneous documents excluding current case', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          form: {
            eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
          },
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [
              {
                ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Same Case',
              },
              {
                ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Different Case',
              },
            ],
            isLeadCase: true,
          },
          modal: {},
        },
      });

      expect(result.additionalServedCases).toEqual([
        {
          docketNumber:
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          caseTitle: 'Different Case',
        },
      ]);
    });
  });

  describe('paperPartiesConsolidated', () => {
    it('should be undefined when there are no paper service parties in consolidated cases', () => {
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
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
                  },
                ],
                petitioners: [
                  {
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC,
                  },
                ],
                privatePractitioners: [],
              },
            ],
            isLeadCase: true,
          },
          modal: {},
        },
      });

      expect(result.paperPartiesConsolidated).toBeUndefined();
    });

    it('should be undefined when there are no consolidated cases', () => {
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

      expect(result.paperPartiesConsolidated).toBeUndefined();
    });

    it('should return paper service parties from consolidated cases with their docket numbers', () => {
      const mockPetitionerName = 'Petitioner Dawn';
      const mockPrivatePractitionerName = 'Attorney McGurney';

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
                petitioners: [
                  {
                    contactId: '4ec5f36a-d58b-4c0d-9118-3e0ff5a4bc78',
                    contactType: ROLES.petitioner,
                    name: mockPetitionerName,
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
                  },
                ],
                privatePractitioners: [
                  {
                    name: mockPrivatePractitionerName,
                    role: ROLES.privatePractitioner,
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
                    userId: '9899623c-7955-4e28-be57-c1eb0315ad42',
                  },
                ],
                irsPractitioners: [],
              },
            ],
            isLeadCase: true,
          },
          modal: {},
        },
      });

      expect(result.paperPartiesConsolidated).toHaveLength(2);
      expect(result.paperPartiesConsolidated).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            name: mockPetitionerName,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            docketNumber:
              MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          }),
          expect.objectContaining({
            name: mockPrivatePractitionerName,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
            docketNumber:
              MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          }),
        ]),
      );
    });
  });
});
