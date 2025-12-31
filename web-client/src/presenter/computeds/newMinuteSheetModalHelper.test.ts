import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { newMinuteSheetModalHelper as newMinuteSheetModalHelperComputed } from './newMinuteSheetModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('newMinuteSheetModalHelper', () => {
  const newMinuteSheetModalHelper = withAppContextDecorator(
    newMinuteSheetModalHelperComputed,
    applicationContext,
  );

  describe('caseDetailLink', () => {
    it('should generate a case detail link when caseInfo exists with docketNumber', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Test Case',
              docketNumber: '101-20',
              docketNumberWithSuffix: '101-20',
            },
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.caseDetailLink).toBe('/case-detail/101-20');
    });

    it('should return undefined for caseDetailLink when caseInfo is not set', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.caseDetailLink).toBeUndefined();
    });

    it('should return undefined for caseDetailLink when caseInfo has no docketNumber', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {},
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.caseDetailLink).toBeUndefined();
    });
  });

  describe('consolidatedCaseMessage', () => {
    it('should return a consolidated case message when case has a different lead case', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Member Case',
              docketNumber: '102-20',
              docketNumberWithSuffix: '102-20',
              leadDocketNumber: '101-20',
            },
            form: {
              docketNumber: '102-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.consolidatedCaseMessage).toBe(
        'This is a consolidated case. The minute sheet will be created for the lead case 101-20.',
      );
      expect(result.isConsolidatedCase).toBe(true);
    });

    it('should return undefined for consolidatedCaseMessage when case is the lead case', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Lead Case',
              docketNumber: '101-20',
              docketNumberWithSuffix: '101-20',
              leadDocketNumber: '101-20',
            },
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.consolidatedCaseMessage).toBeUndefined();
      expect(result.isConsolidatedCase).toBe(false);
    });

    it('should return undefined for consolidatedCaseMessage when case has no lead case', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Standalone Case',
              docketNumber: '101-20',
              docketNumberWithSuffix: '101-20',
            },
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.consolidatedCaseMessage).toBeUndefined();
      expect(result.isConsolidatedCase).toBe(false);
    });
  });

  describe('showCaseLink', () => {
    it('should return true when caseInfo exists and there are no validation errors', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Test Case',
              docketNumber: '101-20',
            },
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.showCaseLink).toBe(true);
    });

    it('should return false when there are validation errors', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Test Case',
              docketNumber: '101-20',
            },
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {
            docketNumber: 'Enter a valid docket number',
          },
        },
      });

      expect(result.showCaseLink).toBe(false);
    });

    it('should return false when caseInfo is not set', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.showCaseLink).toBe(false);
    });
  });

  describe('hasValidationError', () => {
    it('should return true when there is a docketNumber validation error', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {
              docketNumber: 'invalid',
            },
          },
          validationErrors: {
            docketNumber: 'Enter a valid docket number',
          },
        },
      });

      expect(result.hasValidationError).toBe(true);
    });

    it('should return false when there are no validation errors', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Test Case',
              docketNumber: '101-20',
            },
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.hasValidationError).toBe(false);
    });
  });

  describe('minuteSheetDocketNumber', () => {
    it('should return leadDocketNumber when case is consolidated', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Member Case',
              docketNumber: '102-20',
              leadDocketNumber: '101-20',
            },
            form: {
              docketNumber: '102-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.minuteSheetDocketNumber).toBe('101-20');
    });

    it('should return docketNumber when case is not consolidated', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Standalone Case',
              docketNumber: '101-20',
            },
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.minuteSheetDocketNumber).toBe('101-20');
    });

    it('should return undefined when caseInfo is not set', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.minuteSheetDocketNumber).toBeUndefined();
    });
  });

  describe('caseInfo', () => {
    it('should return caseInfo from state', () => {
      const mockCaseInfo = {
        caseCaption: 'Test Case',
        docketNumber: '101-20',
        docketNumberWithSuffix: '101-20S',
      };

      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: mockCaseInfo,
            form: {
              docketNumber: '101-20',
            },
          },
          validationErrors: {},
        },
      });

      expect(result.caseInfo).toEqual(mockCaseInfo);
    });

    it('should return undefined when caseInfo is not in state', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {},
          },
          validationErrors: {},
        },
      });

      expect(result.caseInfo).toBeUndefined();
    });
  });
});
