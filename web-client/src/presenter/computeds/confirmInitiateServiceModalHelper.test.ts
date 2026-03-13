import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '@shared/test/mockCase';
import {
  NON_MULTI_DOCKETABLE_EVENT_CODES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@web-client/applicationContext';
import { cloneDeep } from 'lodash';
import { confirmInitiateServiceModalHelper as confirmInitiateServiceModalHelperComputed } from '@web-client/presenter/computeds/confirmInitiateServiceModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('confirmInitiateServiceModalHelper', () => {
  const mockEventCode = 'OSC';
  const mockDocketEntryId = 'bd7f9cda-a9b1-427a-8121-82ac5d78094d';

  const confirmInitiateServiceModalHelper = withAppContextDecorator(
    confirmInitiateServiceModalHelperComputed,
    applicationContext,
  );

  const baseState = cloneDeep({
    form: {
      eventCode: mockEventCode,
      multiDocketedOn: [],
    },
    formattedCaseDetail: {
      ...MOCK_CASE,
      docketEntries: [],
    },
    modal: {
      form: {
        consolidatedCasesToMultiDocketOn: [],
      },
    },
  });

  describe('allowMultiDocketing', () => {
    it('should be true when the docket entry is being served on a lead case with a multi-docketable event code', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
        },
      });

      expect(result.allowMultiDocketing).toEqual(true);
    });

    it('should be false when the docket entry is being served on a non-consolidated case', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: baseState,
      });

      expect(result.allowMultiDocketing).toEqual(false);
    });

    it('should be false when the docket entry has a non-multi-docketable event code', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          form: {
            ...baseState.form,
            eventCode: NON_MULTI_DOCKETABLE_EVENT_CODES[0],
          },
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
        },
      });

      expect(result.allowMultiDocketing).toEqual(false);
    });

    it('should be false when on a lead case but the docket entry was filed by an external user and not multidocketed', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          form: {
            ...baseState.form,
            filedByRole: ROLES.petitioner,
          },
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
        },
      });

      expect(result.allowMultiDocketing).toEqual(false);
    });

    it('should use the current docket entry when form does not have an event code', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          docketEntryId: mockDocketEntryId,
          form: {
            multiDocketedOn: [],
          },
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                eventCode: mockEventCode,
                multiDocketedOn: [],
              },
            ],
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
        },
      });

      expect(result.allowMultiDocketing).toEqual(true);
    });
  });

  describe('confirmationText', () => {
    it('should not include "selected cases" when the docket entry is not being served across a consolidated group', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: baseState,
      });

      expect(result.confirmationText).toEqual(
        'The following document will be served on all parties:',
      );
    });

    it('should include "selected cases" when the docket entry is being served on a consolidated group', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
            docketEntries: [],
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
    it('should be undefined when there are no parties being served that have paper service', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            irsPractitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
            ],
            petitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_NONE },
            ],
            privatePractitioners: [],
          },
        },
      });

      expect(result.contactsNeedingPaperService).toBeUndefined();
    });

    it('should handle case without irsPractitioners, petitioners, or privatePractitioners', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            irsPractitioners: undefined,
            petitioners: undefined,
            privatePractitioners: undefined,
          },
        },
      });

      expect(result.contactsNeedingPaperService).toBeUndefined();
    });

    it('should return the list of paper service parties with correct format when the docket entry is being served on a non-consolidated case', () => {
      const mockPrivatePractitionerName = 'Attorney McGurney';

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            irsPractitioners: [
              { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
            ],
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

    it('should return paper service parties with IRS practitioner formatted as Respondent Counsel', () => {
      const mockIrsPractitionerName = 'IRS Attorney';

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            irsPractitioners: [
              {
                name: mockIrsPractitionerName,
                role: ROLES.irsPractitioner,
                serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
              },
            ],
            petitioners: [],
            privatePractitioners: [],
          },
        },
      });

      expect(result.contactsNeedingPaperService).toEqual([
        {
          name: mockIrsPractitionerName,
          formattedContactType: 'Respondent Counsel',
          docketNumber: MOCK_CASE.docketNumber,
        },
      ]);
    });

    it('should return paper service parties with petitioner formatted using CONTACT_TYPE_TITLES', () => {
      const mockPetitionerName = 'John Petitioner';

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            irsPractitioners: [],
            petitioners: [
              {
                contactType: 'petitioner',
                name: mockPetitionerName,
                serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
              },
            ],
            privatePractitioners: [],
          },
        },
      });

      expect(result.contactsNeedingPaperService).toEqual([
        {
          name: mockPetitionerName,
          formattedContactType: 'Petitioner',
          docketNumber: MOCK_CASE.docketNumber,
        },
      ]);
    });

    it('should return paper service parties from consolidated cases when multi-docketing is allowed', () => {
      const mockPrivatePractitionerName = 'Attorney McGurney';
      const mockPetitionerName = 'Petitioner Dawn';
      const mockIrsPractitionerName = 'IRS Macbeth';

      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [
              {
                ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
                irsPractitioners: [
                  { serviceIndicator: SERVICE_INDICATOR_TYPES.SI_ELECTRONIC },
                ],
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
                    contactType: 'petitioner',
                    name: mockPetitionerName,
                    serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
                  },
                ],
                privatePractitioners: [],
              },
            ],
            docketEntries: [],
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
          {
            name: mockPrivatePractitionerName,
            formattedContactType: 'Petitioner Counsel',
            docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          },
          {
            name: mockIrsPractitionerName,
            formattedContactType: 'Respondent Counsel',
            docketNumber:
              MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          },
          {
            name: mockPetitionerName,
            formattedContactType: 'Petitioner',
            docketNumber:
              MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          },
        ]),
      );
    });
  });

  describe('additionalServedCases', () => {
    it('should return empty array when multi-docketing is not allowed', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: baseState,
      });

      expect(result.additionalServedCases).toEqual([]);
    });

    it('should return additional served cases excluding the current case when multi-docketing is allowed', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [
              {
                ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Lead Case Title',
              },
              {
                ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Consolidated Case Title',
              },
            ],
            docketEntries: [],
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

      expect(result.additionalServedCases).toEqual([
        {
          docketNumber:
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          caseTitle: 'Consolidated Case Title',
        },
      ]);
    });

    it('should only include checked cases in additionalServedCases', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            consolidatedCases: [
              {
                ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Lead Case Title',
              },
              {
                ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
                caseTitle: 'Consolidated Case Title',
              },
            ],
            docketEntries: [],
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

      expect(result.additionalServedCases).toEqual([]);
    });
  });

  describe('paperFilingText', () => {
    it('should return multi-docketing text when multi-docketing is allowed', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            consolidatedCases: [MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE],
            leadDocketNumber: MOCK_CASE.docketNumber,
          },
        },
      });

      expect(result.paperFilingText).toEqual(
        'Paper service is required for these parties:',
      );
    });

    it('should return single case text when multi-docketing is not allowed', () => {
      const result = runCompute(confirmInitiateServiceModalHelper, {
        state: baseState,
      });

      expect(result.paperFilingText).toEqual(
        'This case has parties receiving paper service:',
      );
    });
  });
});
