import {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} from '../../../../shared/src/test/mockCase';
import { ROLES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { cloneDeep } from 'lodash';
import { confirmPaperServiceModalHelper as confirmPaperServiceModalHelperComputed } from './confirmPaperServiceModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('confirmPaperServiceModalHelper', () => {
  const mockDocketEntryId = 'bd7f9cda-a9b1-427a-8121-82ac5d78094d';

  const confirmPaperServiceModalHelper = withAppContextDecorator(
    confirmPaperServiceModalHelperComputed,
    applicationContext,
  );

  const baseState = cloneDeep({
    docketEntryId: mockDocketEntryId,
    formattedCaseDetail: {
      ...MOCK_CASE,
      consolidatedCases: [],

      docketEntries: [
        {
          docketEntryId: mockDocketEntryId,
          multiDocketedOn: [MOCK_CASE.docketNumber],
        },
      ],
    },
    paperServiceParties: [],
  });

  describe('wasMultiDocketed', () => {
    it('should be false when multiDocketedOn has only one docket number', () => {
      const result = runCompute(confirmPaperServiceModalHelper, {
        state: baseState,
      });

      expect(result.wasMultiDocketed).toEqual(false);
    });

    it('should be true when multiDocketedOn has more than one docket number', () => {
      const result = runCompute(confirmPaperServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                multiDocketedOn: [
                  MOCK_CASE.docketNumber,
                  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                ],
              },
            ],
          },
        },
      });

      expect(result.wasMultiDocketed).toEqual(true);
    });
  });

  describe('multiDocketedOn', () => {
    it('should return an empty array when no case in consolidated cases match the docket numbers in multiDocketedOn', () => {
      const result = runCompute(confirmPaperServiceModalHelper, {
        state: baseState,
      });

      expect(result.multiDocketedOn).toEqual([]);
    });

    it('should return consolidated cases that match the docket numbers in multiDocketedOn', () => {
      const result = runCompute(confirmPaperServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            consolidatedCases: [
              { ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE },
              { ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE },
            ],
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                multiDocketedOn: [
                  MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
                  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                ],
              },
            ],
          },
        },
      });

      expect(result.multiDocketedOn).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          }),
          expect.objectContaining({
            docketNumber:
              MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          }),
        ]),
      );
    });
  });

  describe('paperFilingText', () => {
    it('should set paperFilingText correctly when not multidocketed', () => {
      const result = runCompute(confirmPaperServiceModalHelper, {
        state: baseState,
      });

      expect(result.paperFilingText).toEqual(
        'This case has parties receiving paper service:',
      );
    });

    it('should set paperFilingText correctly when multidocketed', () => {
      const result = runCompute(confirmPaperServiceModalHelper, {
        state: {
          ...baseState,
          formattedCaseDetail: {
            ...baseState.formattedCaseDetail,
            docketEntries: [
              {
                docketEntryId: mockDocketEntryId,
                multiDocketedOn: [
                  MOCK_CASE.docketNumber,
                  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
                ],
              },
            ],
          },
        },
      });

      expect(result.paperFilingText).toEqual(
        'Paper service is required for these parties:',
      );
    });
  });

  describe('contactsNeedingPaperService', () => {
    it('should return an empty array when there are no paper service parties', () => {
      const result = runCompute(confirmPaperServiceModalHelper, {
        state: baseState,
      });

      expect(result.contactsNeedingPaperService).toEqual([]);
    });

    it('should format paper service parties with petitioner counsel role', () => {
      const mockName = 'Attorney Goodman';

      const result = runCompute(confirmPaperServiceModalHelper, {
        state: {
          ...baseState,
          paperServiceParties: [
            {
              name: mockName,
              role: ROLES.privatePractitioner,
              docketNumber: MOCK_CASE.docketNumber,
            },
          ],
        },
      });

      expect(result.contactsNeedingPaperService).toEqual([
        {
          name: mockName,
          formattedContactType: 'Petitioner Counsel',
          docketNumber: MOCK_CASE.docketNumber,
        },
      ]);
    });

    it('should format paper service parties with petitioner contact type', () => {
      const mockName = 'John Petitioner';

      const result = runCompute(confirmPaperServiceModalHelper, {
        state: {
          ...baseState,
          paperServiceParties: [
            {
              name: mockName,
              contactType: 'petitioner',
              docketNumber: MOCK_CASE.docketNumber,
            },
          ],
        },
      });

      expect(result.contactsNeedingPaperService).toEqual([
        {
          name: mockName,
          formattedContactType: 'Petitioner',
          docketNumber: MOCK_CASE.docketNumber,
        },
      ]);
    });
  });
});
