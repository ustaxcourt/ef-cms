import {
  DOCKET_CLERK_REPORT_PAGE_TYPE_OPTIONS,
  DOCKET_CLERK_REPORT_PAGE_TYPES,
} from './docketClerkReportConstants';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { docketClerkReportHelper as docketClerkReportHelperComputed } from './docketClerkReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('docketClerkReportHelper', () => {
  const docketClerkReportHelper = withAppContextDecorator(
    docketClerkReportHelperComputed,
    applicationContext,
  );

  const mockClerks = [
    { name: 'Alice Jones', userId: 'a1' },
    { name: 'Bob Smith', userId: 'b1' },
  ];

  const baseState = {
    docketClerkReport: {
      docketClerks: mockClerks,
      form: {},
      pageType: null,
      selectedClerk: null,
    },
    validationErrors: {},
  };

  describe('docketClerkOptions', () => {
    it('should return clerk options mapped from docketClerks', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: baseState,
      });

      expect(result.docketClerkOptions).toEqual([
        { name: 'Alice Jones', userId: 'a1' },
        { name: 'Bob Smith', userId: 'b1' },
      ]);
    });

    it('should return an empty array when docketClerks is empty', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          docketClerkReport: {
            ...baseState.docketClerkReport,
            docketClerks: [],
          },
        },
      });

      expect(result.docketClerkOptions).toEqual([]);
    });
  });

  describe('pageTypeOptions', () => {
    it('should return the constant page type options', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: baseState,
      });

      expect(result.pageTypeOptions).toEqual(
        DOCKET_CLERK_REPORT_PAGE_TYPE_OPTIONS,
      );
    });
  });

  describe('errors', () => {
    it('should return null when errors is null', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: baseState,
      });

      expect(result.errors).toBeNull();
    });

    it('should return the errors object when present', () => {
      const errors = {
        docketClerkUserId: 'Select a Docket Clerk',
        pageType: 'Select a Page Type',
      };
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          validationErrors: errors,
        },
      });

      expect(result.errors).toEqual(errors);
    });
  });

  describe('showResults', () => {
    it('should be false when selectedClerk is null', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          docketClerkReport: {
            ...baseState.docketClerkReport,
            pageType: 'documentQC',
            selectedClerk: null,
          },
        },
      });

      expect(result.showResults).toBe(false);
    });

    it('should be false when pageType is null', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          docketClerkReport: {
            ...baseState.docketClerkReport,
            pageType: null,
            selectedClerk: { name: 'Alice', userId: 'a1' },
          },
        },
      });

      expect(result.showResults).toBe(false);
    });

    it('should be true when both selectedClerk and pageType are set', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          docketClerkReport: {
            ...baseState.docketClerkReport,
            pageType: 'documentQC',
            selectedClerk: { name: 'Alice', userId: 'a1' },
          },
        },
      });

      expect(result.showResults).toBe(true);
    });
  });

  describe('showDocumentQc / showMessages', () => {
    it('should set showDocumentQc true and showMessages false for documentQC page type', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          docketClerkReport: {
            ...baseState.docketClerkReport,
            pageType: DOCKET_CLERK_REPORT_PAGE_TYPES.documentQC,
            selectedClerk: { name: 'Alice', userId: 'a1' },
          },
        },
      });

      expect(result.showDocumentQc).toBe(true);
      expect(result.showMessages).toBe(false);
    });

    it('should set showMessages true and showDocumentQc false for messages page type', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          docketClerkReport: {
            ...baseState.docketClerkReport,
            pageType: DOCKET_CLERK_REPORT_PAGE_TYPES.messages,
            selectedClerk: { name: 'Alice', userId: 'a1' },
          },
        },
      });

      expect(result.showMessages).toBe(true);
      expect(result.showDocumentQc).toBe(false);
    });
  });

  describe('reportTitle', () => {
    it('should return empty string when results are not shown', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: baseState,
      });

      expect(result.reportTitle).toBe('');
    });

    it('should return "{name}\'s Document QC" for documentQC page type', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          docketClerkReport: {
            ...baseState.docketClerkReport,
            pageType: DOCKET_CLERK_REPORT_PAGE_TYPES.documentQC,
            selectedClerk: { name: 'Alice Jones', userId: 'a1' },
          },
        },
      });

      expect(result.reportTitle).toBe("Alice Jones's Document QC");
    });

    it('should return "{name}\'s Messages" for messages page type', () => {
      const result = runCompute(docketClerkReportHelper, {
        state: {
          ...baseState,
          docketClerkReport: {
            ...baseState.docketClerkReport,
            pageType: DOCKET_CLERK_REPORT_PAGE_TYPES.messages,
            selectedClerk: { name: 'Bob Smith', userId: 'b1' },
          },
        },
      });

      expect(result.reportTitle).toBe("Bob Smith's Messages");
    });
  });
});
