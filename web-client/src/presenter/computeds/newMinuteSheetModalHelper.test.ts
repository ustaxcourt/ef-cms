import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { newMinuteSheetModalHelper as newMinuteSheetModalHelperComputed } from './newMinuteSheetModalHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('newMinuteSheetModalHelper', () => {
  const newMinuteSheetModalHelper = withAppContextDecorator(
    newMinuteSheetModalHelperComputed,
    applicationContext,
  );

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
          trialSession: {
            trialSessionId: 'abc-123',
          },
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
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.caseInfo).toBeUndefined();
    });
  });

  describe('hasSearched', () => {
    it('should return true when hasSearched is true in modal state', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            hasSearched: true,
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.hasSearched).toBe(true);
    });

    it('should return false when hasSearched is not set', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.hasSearched).toBe(false);
    });
  });

  describe('noResultsFound', () => {
    it('should return true when noResultsFound is true in modal state', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            hasSearched: true,
            noResultsFound: true,
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.noResultsFound).toBe(true);
    });

    it('should return false when noResultsFound is not set', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.noResultsFound).toBe(false);
    });
  });

  describe('isCaseAlreadyOnTrialSession', () => {
    it('should return true when isCaseAlreadyOnTrialSession is true in modal state', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            hasSearched: true,
            isCaseAlreadyOnTrialSession: true,
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.isCaseAlreadyOnTrialSession).toBe(true);
    });

    it('should return false when isCaseAlreadyOnTrialSession is not set', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.isCaseAlreadyOnTrialSession).toBe(false);
    });
  });

  describe('showCaseConfirmation', () => {
    it('should return true when hasSearched is true, caseInfo exists, and no errors', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Test Case',
              docketNumber: '101-20',
            },
            hasSearched: true,
            noResultsFound: false,
            isCaseAlreadyOnTrialSession: false,
            form: {
              docketNumber: '101-20',
            },
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.showCaseConfirmation).toBe(true);
    });

    it('should return false when noResultsFound is true', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Test Case',
              docketNumber: '101-20',
            },
            hasSearched: true,
            noResultsFound: true,
            form: {
              docketNumber: '101-20',
            },
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.showCaseConfirmation).toBe(false);
    });

    it('should return false when isCaseAlreadyOnTrialSession is true', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            caseInfo: {
              caseCaption: 'Test Case',
              docketNumber: '101-20',
            },
            hasSearched: true,
            isCaseAlreadyOnTrialSession: true,
            form: {
              docketNumber: '101-20',
            },
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.showCaseConfirmation).toBe(false);
    });

    it('should return false when caseInfo is null', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            hasSearched: true,
            form: {
              docketNumber: '101-20',
            },
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.showCaseConfirmation).toBe(false);
    });
  });

  describe('editUnscheduledMinutesList', () => {
    it('should return the list of previously edited minute sheets', () => {
      const mockList = [
        {
          docketNumber: '101-20',
          docketNumberWithSuffix: '101-20S',
          caseCaption: 'Test Case 1',
        },
        {
          docketNumber: '102-20',
          docketNumberWithSuffix: '102-20L',
          caseCaption: 'Test Case 2',
        },
      ];

      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            editUnscheduledMinutesList: mockList,
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.editUnscheduledMinutesList).toEqual(mockList);
    });

    it('should return empty array when editUnscheduledMinutesList is not set', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.editUnscheduledMinutesList).toEqual([]);
    });
  });

  describe('trialSessionId', () => {
    it('should return trialSessionId from trial session state', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {},
          },
          trialSession: {
            trialSessionId: 'abc-123',
          },
        },
      });

      expect(result.trialSessionId).toBe('abc-123');
    });

    it('should return empty string when trialSession is not set', () => {
      const result = runCompute(newMinuteSheetModalHelper, {
        state: {
          modal: {
            form: {},
          },
        },
      });

      expect(result.trialSessionId).toBe('');
    });
  });
});
