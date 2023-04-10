import { GetCaseInventoryReportRequest } from '../../../../../shared/src/business/useCases/caseInventoryReport/getCustomCaseInventoryReportInteractor';
import { applicationContextForClient as applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import { presenter } from '../../presenter-mock';
import { runAction } from 'cerebral/test';
import { setCustomCaseInventoryFiltersAction } from './setCustomCaseInventoryFiltersAction';

presenter.providers.applicationContext = applicationContext;

describe('setCustomCaseInventoryFiltersAction', () => {
  const expectedDate = '2019-05-14T04:00:00.000Z';
  const regularDate = '05/14/2019';
  let initialFilterState: GetCaseInventoryReportRequest;
  beforeEach(() => {
    initialFilterState = {
      caseStatuses: [],
      caseTypes: [],
      createEndDate: '',
      createStartDate: '',
      filingMethod: 'all',
    };
  });

  it('should set customCaseInventoryFilters createStartDate in state', async () => {
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        createStartDate: regularDate,
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.createStartDate).toEqual(
      expectedDate,
    );
  });

  it('should set customCaseInventoryFilters createEndDate in state', async () => {
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        createEndDate: regularDate,
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.createEndDate).toEqual(
      expectedDate,
    );
  });

  it('should set filing method in state', async () => {
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        filingMethod: 'electronic',
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.filingMethod).toEqual(
      'electronic',
    );
  });

  it('should add a caseStatus filter to state', async () => {
    initialFilterState.caseStatuses = ['Assigned - Case'];
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        caseStatuses: { action: 'add', caseStatus: 'CAV' },
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.caseStatuses).toEqual([
      'Assigned - Case',
      'CAV',
    ]);
  });

  it('should not add a case status that has previously been selected', async () => {
    initialFilterState.caseStatuses = ['Assigned - Case'];
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        caseStatuses: { action: 'add', caseStatus: 'Assigned - Case' },
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.caseStatuses).toEqual([
      'Assigned - Case',
    ]);
  });

  it('should remove a caseStatus filter from state', async () => {
    initialFilterState.caseStatuses = ['Assigned - Case', 'CAV'];
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        caseStatuses: { action: 'remove', caseStatus: 'CAV' },
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.caseStatuses).toEqual([
      'Assigned - Case',
    ]);
  });

  it('should add a caseType filter to state', async () => {
    initialFilterState.caseTypes = ['Deficiency'];
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        caseTypes: { action: 'add', caseType: 'Disclosure' },
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.caseTypes).toEqual([
      'Deficiency',
      'Disclosure',
    ]);
  });

  it('should not add a caseType filter that has previously been selected', async () => {
    initialFilterState.caseTypes = ['Deficiency', 'Disclosure'];
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        caseTypes: { action: 'add', caseType: 'Deficiency' },
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.caseTypes).toEqual([
      'Deficiency',
      'Disclosure',
    ]);
  });

  it('should remove a case type filter from state', async () => {
    initialFilterState.caseTypes = ['Deficiency', 'Disclosure'];
    const result = await runAction(setCustomCaseInventoryFiltersAction, {
      modules: { presenter },
      props: {
        caseTypes: { action: 'remove', caseType: 'Disclosure' },
      },
      state: {
        customCaseInventoryFilters: initialFilterState,
      },
    });

    expect(result.state.customCaseInventoryFilters.caseTypes).toEqual([
      'Deficiency',
    ]);
  });
});
