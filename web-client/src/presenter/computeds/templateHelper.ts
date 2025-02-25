import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';
export const templateHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const initialBetaBarState = get(state.header.showBetaBar);
  const isProduction = applicationContext.getEnvironment().stage === 'prod';

  const showBetaBar = !isProduction && initialBetaBarState;
  const showDeployedDate = !isProduction;

  return {
    showBetaBar,
    showDeployedDate,
  };
};
