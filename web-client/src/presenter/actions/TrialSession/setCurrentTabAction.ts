import { state } from '@web-client/presenter/app.cerebral';

export const setCurrentTabAction = ({ props, store }: ActionProps) => {
  store.set(state.trialLocationPage.currentTab, props.currentTab);
};
