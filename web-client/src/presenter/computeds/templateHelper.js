import { state } from 'cerebral';

export const templateHelper = (get, applicationContext) => {
  const initialBetaBarState = get(state.header.showBetaBar);
  const isProduction = applicationContext.getEnvironment().stage === 'prod';

  let showBetaBar;
  let showDeployedDate;

  if (applicationContext.isCodeEnabled(7142)) {
    showBetaBar = !isProduction && initialBetaBarState;
    showDeployedDate = !isProduction;
  } else {
    showBetaBar = initialBetaBarState;
    showDeployedDate = true;
  }

  return {
    showBetaBar,
    showDeployedDate,
  };
};
