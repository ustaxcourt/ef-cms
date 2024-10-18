import { cloneDeep } from 'lodash';
import { initialTrialSessionPageState } from '@web-client/presenter/state/trialSessionsPageState';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setTrialSessionsFiltersAction } from './setTrialSessionsFiltersAction';

describe('setTrialSessionsFiltersAction', () => {
  let trialSessionsPageState: typeof initialTrialSessionPageState;
  beforeEach(() => {
    trialSessionsPageState = cloneDeep(initialTrialSessionPageState);
  });

  describe('currentTab', () => {
    it('should set the current tab to calendared', async () => {
      trialSessionsPageState.filters.currentTab = 'new';

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          currentTab: 'calendared',
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.currentTab).toEqual(
        'calendared',
      );
    });
  });
  describe('judges', () => {
    it('should add a judge to the current set of filters', async () => {
      trialSessionsPageState.filters.judges = {};
      const judgeToAdd = { name: 'doot', userId: '4298374' };

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          judges: { action: 'add', judge: judgeToAdd },
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.judges).toEqual({
        ['4298374']: judgeToAdd,
      });
    });

    it('should remove a judge from the current set of filters', async () => {
      const judgeToRemove = { name: 'doot', userId: '4298374' };

      trialSessionsPageState.filters.judges = {
        ['4298374']: judgeToRemove,
      };

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          judges: { action: 'remove', judge: judgeToRemove },
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.judges).toEqual({});
    });
  });
  describe('proceedingType', () => {
    it('should set the proceedingType filter to Remote', async () => {
      trialSessionsPageState.filters.proceedingType = 'All';

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          proceedingType: 'Remote',
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.proceedingType).toEqual(
        'Remote',
      );
    });
  });
  describe('sessionStatus', () => {
    it('should set the sessionStatus filter to Closed', async () => {
      trialSessionsPageState.filters.sessionStatus = 'Open';

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          sessionStatus: 'Closed',
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.sessionStatus).toEqual(
        'Closed',
      );
    });
  });
  describe('sessionType', () => {
    it('should add a sessionType to the current set of filters', async () => {
      trialSessionsPageState.filters.sessionTypes = {};

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          sessionTypes: { action: 'add', sessionType: 'Regular' },
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.sessionTypes).toEqual({
        Regular: 'Regular',
      });
    });

    it('should remove a sessionType from the current set of filters', async () => {
      trialSessionsPageState.filters.sessionTypes = {
        Regular: 'Regular',
      };

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          sessionTypes: { action: 'remove', sessionType: 'Regular' },
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.sessionTypes).toEqual({});
    });
  });
  describe('trialLocation', () => {
    it('should add a trialLocation to the current set of filters', async () => {
      trialSessionsPageState.filters.trialLocations = {};

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          trialLocations: {
            action: 'add',
            trialLocation: 'Birmingham, Alabama',
          },
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.trialLocations).toEqual({
        'Birmingham, Alabama': 'Birmingham, Alabama',
      });
    });

    it('should remove a trialLocation from the current set of filters', async () => {
      trialSessionsPageState.filters.trialLocations = {
        'Birmingham, Alabama': 'Birmingham, Alabama',
      };

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          trialLocations: {
            action: 'remove',
            trialLocation: 'Birmingham, Alabama',
          },
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.trialLocations).toEqual({});
    });
  });
  describe('startDate', () => {
    it('should set the startDate filter', async () => {
      trialSessionsPageState.filters.startDate = '';

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          startDate: '9/27/24',
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.startDate).toEqual(
        '9/27/24',
      );
    });

    it('should remove the startDate filter', async () => {
      trialSessionsPageState.filters.startDate = '9/27/24';

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          startDate: '',
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.startDate).toEqual('');
    });
  });
  describe('endDate', () => {
    it('should set the endDate filter', async () => {
      trialSessionsPageState.filters.endDate = '';

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          endDate: '9/27/24',
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.endDate).toEqual('9/27/24');
    });

    it('should remove the endDate filter', async () => {
      trialSessionsPageState.filters.endDate = '9/27/24';

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          endDate: '',
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.endDate).toEqual('');
    });
  });
  describe('pageNumber', () => {
    it('should set the pageNumber filter', async () => {
      trialSessionsPageState.filters.pageNumber = 0;

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          pageNumber: 1,
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.pageNumber).toEqual(1);
    });

    it('should reset the pageNumber filter', async () => {
      trialSessionsPageState.filters.pageNumber = 1;

      const result = await runAction(setTrialSessionsFiltersAction, {
        props: {
          pageNumber: undefined,
        },
        state: { trialSessionsPage: trialSessionsPageState },
      });

      expect(result.state.trialSessionsPage.filters.pageNumber).toEqual(0);
    });
  });
});
