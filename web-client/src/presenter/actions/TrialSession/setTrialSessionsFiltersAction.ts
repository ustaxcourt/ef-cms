import { TrialSessionProceedingType } from '@shared/business/entities/EntityConstants';
import { state } from '@web-client/presenter/app.cerebral';

export type SetTrialSessionsFilters = Partial<{
  currentTab: 'calendared' | 'new';
  judgeIds: { action: 'add' | 'remove'; judgeId: string };
  proceedingType: TrialSessionProceedingType | 'All';
  sessionStatus: string;
  sessionType: string;
  trialLocation: string;
}>;

export const setTrialSessionsFiltersAction = ({
  get,
  props,
  store,
}: ActionProps<SetTrialSessionsFilters>) => {
  const currentFilters = get(state.trialSessionsPage.filters);

  if (props.currentTab) {
    store.set(state.trialSessionsPage.filters.currentTab, props.currentTab);
  }

  if (props.judgeIds) {
    const newJudgeIds =
      props.judgeIds.action === 'add'
        ? currentFilters.judgeIds.concat([props.judgeIds.judgeId])
        : currentFilters.judgeIds.filter(
            (id: string) => id !== props.judgeIds!.judgeId,
          );
    store.set(state.trialSessionsPage.filters.judgeIds, newJudgeIds);
  }

  if (props.proceedingType) {
    store.set(
      state.trialSessionsPage.filters.proceedingType,
      props.proceedingType,
    );
  }

  if (props.sessionStatus) {
    store.set(
      state.trialSessionsPage.filters.sessionStatus,
      props.sessionStatus,
    );
  }
  // Update for Trial Sessions Page
  if (props.sessionType) {
    store.set(state.trialSessionsPage.filters.sessionType, props.sessionType);
  }
  // Update for Trial Sessions Page
  if (props.trialLocation) {
    store.set(
      state.trialSessionsPage.filters.trialLocation,
      props.trialLocation,
    );
  }
};
