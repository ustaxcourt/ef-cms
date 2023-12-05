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
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { cloneDeep } from 'lodash';
import { confirmInitiateServiceModalHelper as confirmInitiateServiceModalHelperComputed } from './confirmInitiateServiceModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
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
                    userId: '6f97c469-4f05-4c65-b88d-3fb02c728cc3',
                  },
                ],
                petitioners: [
                  {
                    contactId: '4ec5f36a-d58b-4c0d-9118-3e0ff5a4bc78',
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
                userId: '9899623c-7955-4e28-be57-c1eb0315ad42',
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
        { name: `${mockPetitionerName}, Petitioner` },
        { name: `${mockPrivatePractitionerName}, Petitioner Counsel` },
        { name: `${mockIrsPractitionerName}, Respondent Counsel` },
      ]);
    });

    it('should return a unique list of paper service parties when the docket entry is being served on a consolidated group', () => {
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
                    userId: '3dfe8d03-0034-4e38-9f8f-67b478430330',
                  },
                ],
                petitioners: [
                  {
                    contactId: '65a8d3d5-1b41-4d04-a591-de6327b7c1f4',
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
              {
                name: mockIrsPractitionerName,
                role: ROLES.irsPractitioner,
                serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
                userId: '3dfe8d03-0034-4e38-9f8f-67b478430330',
              },
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

      expect(result.contactsNeedingPaperService).toEqual(
        expect.arrayContaining([
          { name: `${mockPetitionerName}, Petitioner` },
          { name: `${mockPrivatePractitionerName}, Petitioner Counsel` },
          { name: `${mockIrsPractitionerName}, Respondent Counsel` },
        ]),
      );
    });
  });

  describe('showConsolidatedCasesForService', () => {
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

    it('should be false when the docket entry is being filed on a consolidated case that is NOT the lead case', () => {
      const { showConsolidatedCasesForService } = runCompute(
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

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the the docket entry is NOT a document type that can be multi-docketed', () => {
      const { showConsolidatedCasesForService } = runCompute(
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

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the docket entry is being served from a message', () => {
      const { showConsolidatedCasesForService } = runCompute(
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

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be true when the docket entry is being filed on a lead case, and the docket entry is a document type that can be multi-docketed', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            form: {
              documentTitle: 'Answer',
              eventCode: MULTI_DOCKET_FILING_EVENT_CODES[0],
            },
            formattedCaseDetail: {
              isLeadCase: true,
            },
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(true);
    });

    it('should be true when the docket entry is being filed on a lead case, the docket entry is a paper filed, simultaneous document', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            form: {
              eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
              isPaper: true,
            },
            formattedCaseDetail: {
              isLeadCase: true,
            },
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(true);
    });

    it('should be false when the docket entry is being filed on a lead case, the docket entry is a simultaneous document that is NOT paper filed', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            form: {
              documentTitle: 'Simultaneous Answering Memorandum Brief',
              eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
              isPaper: false,
            },
            formattedCaseDetail: {
              isLeadCase: true,
            },
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
    });

    it('should be false when the docket entry is being filed on a lead case, the docket entry has "simultaneous" in the document title and is NOT paper filed', () => {
      const { showConsolidatedCasesForService } = runCompute(
        confirmInitiateServiceModalHelper,
        {
          state: {
            ...baseState,
            form: {
              documentTitle:
                'Motion for Leave to File Simultaneous Answering Memorandum Brief',
              eventCode: 'AMAT',
              isPaper: false,
            },
            formattedCaseDetail: {
              isLeadCase: true,
            },
          },
        },
      );

      expect(showConsolidatedCasesForService).toEqual(false);
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

      expect(result.showPaperAlert).toEqual(true);
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

      expect(result.showPaperAlert).toEqual(false);
    });
  });
});
