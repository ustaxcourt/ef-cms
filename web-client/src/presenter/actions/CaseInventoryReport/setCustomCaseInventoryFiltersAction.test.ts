import { CustomCaseInventoryReportState } from '../../customCaseInventoryReportState';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCustomCaseInventoryFiltersAction } from './setCustomCaseInventoryFiltersAction';

presenter.providers.applicationContext = applicationContext;

describe('setCustomCaseInventoryFiltersAction', () => {
  let initialFilterState: CustomCaseInventoryReportState;
  beforeEach(() => {
    initialFilterState = {
      cases: [],
      filters: {
        caseStatuses: [],
        caseTypes: [],
        createEndDate: '',
        createStartDate: '',
        filingMethod: 'all',
      },
      totalCases: 0,
    };
  });

  describe('createdStartDate', () => {
    it('should set customCaseInventoryFilters createStartDate with an empty string when no createStartDate was provided', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          createStartDate: '',
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.createStartDate).toEqual(
        '',
      );
    });
    it('should set customCaseInventoryFilters createStartDate with a string when a createStartDate was provided', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          createStartDate: 'a truthy item',
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.createStartDate).toEqual(
        'a truthy item',
      );
    });
  });

  describe('createdEndDate', () => {
    it('should set customCaseInventoryFilters createEndDate with an empty string when no createEndDate was provided', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          createEndDate: '',
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.createEndDate).toEqual(
        '',
      );
    });

    it('should set customCaseInventoryFilters createEndDate with a string when a createEndDate was provided', async () => {
      const result = await runAction(setCustomCaseInventoryFiltersAction, {
        modules: { presenter },
        props: {
          createEndDate: 'a truthy item',
        },
        state: {
          customCaseInventory: initialFilterState,
        },
      });

      expect(result.state.customCaseInventory.filters.createEndDate).toEqual(
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
