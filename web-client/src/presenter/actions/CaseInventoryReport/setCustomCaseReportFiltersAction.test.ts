import {
  CustomCaseReportState,
  initialCustomCaseReportState,
} from '../../customCaseReportState';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import { presenter } from '../../presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setCustomCaseReportFiltersAction } from './setCustomCaseReportFiltersAction';

presenter.providers.applicationContext = applicationContext;

describe('setCustomCaseReportFiltersAction', () => {
  let initialFilterState: CustomCaseReportState;
  beforeEach(() => {
    initialFilterState = cloneDeep(initialCustomCaseReportState);
  });

  describe('createdStartDate', () => {
    it('should set customCaseReportFilters startDate with an empty string when no startDate was provided', async () => {
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          startDate: '',
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.startDate).toEqual('');
    });
    it('should set customCaseReportFilters startDate with a string when a startDate was provided', async () => {
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          startDate: 'a truthy item',
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.startDate).toEqual(
        'a truthy item',
      );
    });
  });

  describe('createdEndDate', () => {
    it('should set customCaseReportFilters endDate with an empty string when no endDate was provided', async () => {
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          endDate: '',
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.endDate).toEqual('');
    });

    it('should set customCaseReportFilters endDate with a string when a endDate was provided', async () => {
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          endDate: 'a truthy item',
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.endDate).toEqual(
        'a truthy item',
      );
    });
  });

  it('should set customCaseReportFilters filing method in state', async () => {
    const result = await runAction(setCustomCaseReportFiltersAction, {
      modules: { presenter },
      props: {
        filingMethod: 'electronic',
      },
      state: {
        customCaseReport: initialFilterState,
      },
    });

    expect(result.state.customCaseReport.filters.filingMethod).toEqual(
      'electronic',
    );
  });

  describe('testing caseStatus filters', () => {
    it('should add a caseStatus filter in customCaseReportFilters', async () => {
      initialFilterState.filters.caseStatuses = ['Assigned - Case'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          caseStatuses: { action: 'add', caseStatus: 'CAV' },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.caseStatuses).toEqual([
        'Assigned - Case',
        'CAV',
      ]);
    });

    it('should not add a case status that has previously been selected', async () => {
      initialFilterState.filters.caseStatuses = ['Assigned - Case'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          caseStatuses: { action: 'add', caseStatus: 'Assigned - Case' },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.caseStatuses).toEqual([
        'Assigned - Case',
      ]);
    });

    it('should remove a caseStatus filter from customCaseReportFilters', async () => {
      initialFilterState.filters.caseStatuses = ['Assigned - Case', 'CAV'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          caseStatuses: { action: 'remove', caseStatus: 'CAV' },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.caseStatuses).toEqual([
        'Assigned - Case',
      ]);
    });
  });

  describe('testing caseType filters', () => {
    it('should add a caseType filter to customCaseReportFilters', async () => {
      initialFilterState.filters.caseTypes = ['Deficiency'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          caseTypes: { action: 'add', caseType: 'Disclosure' },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.caseTypes).toEqual([
        'Deficiency',
        'Disclosure',
      ]);
    });

    it('should not add a caseType filter that has previously been selected', async () => {
      initialFilterState.filters.caseTypes = ['Deficiency', 'Disclosure'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          caseTypes: { action: 'add', caseType: 'Deficiency' },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.caseTypes).toEqual([
        'Deficiency',
        'Disclosure',
      ]);
    });

    it('should remove a case type filter from state', async () => {
      initialFilterState.filters.caseTypes = ['Deficiency', 'Disclosure'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          caseTypes: { action: 'remove', caseType: 'Disclosure' },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.caseTypes).toEqual([
        'Deficiency',
      ]);
    });
  });

  describe('testing preferred trial city filters', () => {
    it('should add a preferred trial city filter to customCaseReportFilters', async () => {
      initialFilterState.filters.preferredTrialCities = ['Mobile, Alabama'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          preferredTrialCities: {
            action: 'add',
            preferredTrialCity: 'Seattle, Washington',
          },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(
        result.state.customCaseReport.filters.preferredTrialCities,
      ).toEqual(['Mobile, Alabama', 'Seattle, Washington']);
    });

    it('should not add a trial city that has previously been selected', async () => {
      initialFilterState.filters.preferredTrialCities = [
        'Mobile, Alabama',
        'Seattle, Washington',
      ];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          preferredTrialCities: {
            action: 'add',
            preferredTrialCity: 'Seattle, Washington',
          },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(
        result.state.customCaseReport.filters.preferredTrialCities,
      ).toEqual(['Mobile, Alabama', 'Seattle, Washington']);
    });

    it('should remove a preferred trial city filter from state', async () => {
      initialFilterState.filters.preferredTrialCities = [
        'Mobile, Alabama',
        'Seattle, Washington',
      ];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          preferredTrialCities: {
            action: 'remove',
            preferredTrialCity: 'Mobile, Alabama',
          },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(
        result.state.customCaseReport.filters.preferredTrialCities,
      ).toEqual(['Seattle, Washington']);
    });
  });

  describe('testing judge filters', () => {
    it('should add a judge filter to customCaseReportFilters', async () => {
      initialFilterState.filters.judges = ['Dr. John'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          judges: {
            action: 'add',
            judge: 'Leon Redbone',
          },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.judges).toEqual([
        'Dr. John',
        'Leon Redbone',
      ]);
    });

    it('should not add a judges that has previously been selected', async () => {
      initialFilterState.filters.judges = ['Sonny Rollins', 'Lester Young'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          judges: {
            action: 'add',
            judge: 'Lester Young',
          },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.judges).toEqual([
        'Sonny Rollins',
        'Lester Young',
      ]);
    });

    it('should remove a judge from state', async () => {
      initialFilterState.filters.judges = ['Syd Barrett', 'Roger Waters'];
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          judges: {
            action: 'remove',
            judge: 'Syd Barrett',
          },
        },
        state: {
          customCaseReport: initialFilterState,
        },
      });

      expect(result.state.customCaseReport.filters.judges).toEqual([
        'Roger Waters',
      ]);
    });

    it('should negate the highPriority filter when passed in as props', async () => {
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          highPriority: true,
        },
        state: {
          customCaseReport: {
            ...initialFilterState,
            filters: { highPriority: false },
          },
        },
      });

      expect(result.state.customCaseReport.filters.highPriority).toEqual(true);
    });

    it('should set the procedureType on the filters if one is passed in props', async () => {
      const result = await runAction(setCustomCaseReportFiltersAction, {
        modules: { presenter },
        props: {
          procedureType: 'Small',
        },
        state: {
          customCaseReport: {
            ...initialFilterState,
            filters: { procedureType: 'Regular' },
          },
        },
      });

      expect(result.state.customCaseReport.filters.procedureType).toEqual(
        'Small',
      );
    });
  });
});
