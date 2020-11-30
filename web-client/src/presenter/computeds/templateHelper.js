import { state } from 'cerebral';

export const templateHelper = (get, applicationContext) => {
  const initialBetaBarState = get(state.header.showBetaBar);
  const isProduction = applicationContext.getEnvironment().stage === 'prod';

  const showBetaBar = !isProduction && initialBetaBarState;
  const showDeployedDate = !isProduction;

  return {
    showBetaBar,
    showDeployedDate,
  };
};
