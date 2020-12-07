import { state } from 'cerebral';

export const templateHelper = (get, applicationContext) => {
  const initialBetaBarState = get(state.header.showBetaBar);
  const isProduction = applicationContext.getEnvironment().stage === 'prod';

  let showBetaBar;
  let showDeployedDate;

  showBetaBar = !isProduction && initialBetaBarState;
  showDeployedDate = !isProduction;

  return {
    showBetaBar,
    showDeployedDate,
  };
};
