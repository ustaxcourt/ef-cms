import {
  CustomCaseInventoryReportState,
  initialCustomCaseInventoryReportState,
} from '../../customCaseInventoryReportState';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCustomCaseInventoryFiltersAction } from './setCustomCaseInventoryFiltersAction';

presenter.providers.applicationContext = applicationContext;

describe('setCustomCaseInventoryFiltersAction', () => {
  let initialFilterState: CustomCaseInventoryReportState;
  beforeEach(() => {
    initialFilterState = cloneDeep(initialCustomCaseInventoryReportState);
  });

  describe('createdStartDate', () => {
    it('should set customCaseInventoryFilters startDate with an empty string when no startDate was provided', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          startDate: '',
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.startDate).toEqual('');
    });
    it('should set customCaseInventoryFilters startDate with a string when a startDate was provided', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          startDate: 'a truthy item',
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.startDate).toEqual(
        'a truthy item',
      );
    });
  });

  describe('createdEndDate', () => {
    it('should set customCaseInventoryFilters endDate with an empty string when no endDate was provided', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          endDate: '',
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.endDate).toEqual('');
    });

    it('should set customCaseInventoryFilters endDate with a string when a endDate was provided', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          endDate: 'a truthy item',
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.endDate).toEqual(
        'a truthy item',
      );
    });
  });

  it('should set customCaseInventoryFilters filing method in state', async () => {
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        filingMethod: 'electronic',
      },
      state: {
        customCaseInventory: initialFilterState,
      },
    });

    expect(result.state.customCaseInventory.filters.filingMethod).toEqual(
      'electronic',
    );
  });

  describe('testing caseStatus filters', () => {
    it('should add a caseStatus filter in customCaseInventoryFilters', async () => {
      initialFilterState.filters.caseStatuses = ['Assigned - Case'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          caseStatuses: { action: 'add', caseStatus: 'CAV' },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.caseStatuses).toEqual([
        'Assigned - Case',
        'CAV',
      ]);
    });

    it('should not add a case status that has previously been selected', async () => {
      initialFilterState.filters.caseStatuses = ['Assigned - Case'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          caseStatuses: { action: 'add', caseStatus: 'Assigned - Case' },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.caseStatuses).toEqual([
        'Assigned - Case',
      ]);
    });

    it('should remove a caseStatus filter from customCaseInventoryFilters', async () => {
      initialFilterState.filters.caseStatuses = ['Assigned - Case', 'CAV'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          caseStatuses: { action: 'remove', caseStatus: 'CAV' },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.caseStatuses).toEqual([
        'Assigned - Case',
      ]);
    });
  });

  describe('testing caseType filters', () => {
    it('should add a caseType filter to customCaseInventoryFilters', async () => {
      initialFilterState.filters.caseTypes = ['Deficiency'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          caseTypes: { action: 'add', caseType: 'Disclosure' },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.caseTypes).toEqual([
        'Deficiency',
        'Disclosure',
      ]);
    });

    it('should not add a caseType filter that has previously been selected', async () => {
      initialFilterState.filters.caseTypes = ['Deficiency', 'Disclosure'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          caseTypes: { action: 'add', caseType: 'Deficiency' },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.caseTypes).toEqual([
        'Deficiency',
        'Disclosure',
      ]);
    });

    it('should remove a case type filter from state', async () => {
      initialFilterState.filters.caseTypes = ['Deficiency', 'Disclosure'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          caseTypes: { action: 'remove', caseType: 'Disclosure' },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.caseTypes).toEqual([
        'Deficiency',
      ]);
    });
  });

  describe('testing preferred trial city filters', () => {
    it('should add a preferred trial city filter to customCaseInventoryFilters', async () => {
      initialFilterState.filters.preferredTrialCities = ['Mobile, Alabama'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          preferredTrialCities: {
            action: 'add',
            preferredTrialCity: 'Seattle, Washington',
          },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(
        result.state.customCaseInventory.filters.preferredTrialCities,
      ).toEqual(['Mobile, Alabama', 'Seattle, Washington']);
    });

    it('should not add a trial city that has previously been selected', async () => {
      initialFilterState.filters.preferredTrialCities = [
        'Mobile, Alabama',
        'Seattle, Washington',
      ];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          preferredTrialCities: {
            action: 'add',
            preferredTrialCity: 'Seattle, Washington',
          },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(
        result.state.customCaseInventory.filters.preferredTrialCities,
      ).toEqual(['Mobile, Alabama', 'Seattle, Washington']);
    });

    it('should remove a preferred trial city filter from state', async () => {
      initialFilterState.filters.preferredTrialCities = [
        'Mobile, Alabama',
        'Seattle, Washington',
      ];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          preferredTrialCities: {
            action: 'remove',
            preferredTrialCity: 'Mobile, Alabama',
          },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(
        result.state.customCaseInventory.filters.preferredTrialCities,
      ).toEqual(['Seattle, Washington']);
    });
  });

  describe('testing judge filters', () => {
    it('should add a judge filter to customCaseInventoryFilters', async () => {
      initialFilterState.filters.judges = ['Dr. John'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          judges: {
            action: 'add',
            judge: 'Leon Redbone',
          },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.judges).toEqual([
        'Dr. John',
        'Leon Redbone',
      ]);
    });

    it('should not add a judges that has previously been selected', async () => {
      initialFilterState.filters.judges = ['Sonny Rollins', 'Lester Young'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          judges: {
            action: 'add',
            judge: 'Lester Young',
          },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.judges).toEqual([
        'Sonny Rollins',
        'Lester Young',
      ]);
    });

    it('should remove a judge from state', async () => {
      initialFilterState.filters.judges = ['Syd Barrett', 'Roger Waters'];
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          judges: {
            action: 'remove',
            judge: 'Syd Barrett',
          },
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.judges).toEqual([
        'Roger Waters',
      ]);
    });

    it('should negate the high priority when pass in as props', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          highPriority: true,
        },
        state: {
          customCaseInventory: {
            ...initialFilterState,
            filters: { highPriority: false },
          },
        },
      });

      expect(result.state.customCaseInventory.filters.highPriority).toEqual(
        true,
      );
    });

    it('should set the procedureType on the filters if one is passed in props', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          procedureType: 'Small',
        },
        state: {
          customCaseInventory: {
            ...initialFilterState,
            filters: { procedureType: 'Regular' },
          },
        },
      });

      expect(result.state.customCaseInventory.filters.procedureType).toEqual(
        'Small',
      );
    });
  });
});
