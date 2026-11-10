import { cloneDeep } from 'lodash';
import { initialTrialSessionState } from '@web-client/presenter/state/trialSessionState';
import { state } from '@web-client/presenter/app.cerebral';

export const resetTrialSessionAction = ({ store }: ActionProps): void => {
  store.set(state.trialSession, cloneDeep(initialTrialSessionState));
};
