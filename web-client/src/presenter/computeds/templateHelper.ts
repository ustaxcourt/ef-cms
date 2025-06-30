import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from 'cerebral';

export const templateHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
  const initialBetaBarState = get(state.header.showBetaBar);
  const isProduction = applicationContext.getEnvironment().stage === 'dev';

  console.log('Environment:', applicationContext.getEnvironment());

  const showBetaBar = !isProduction && initialBetaBarState;
  const showDeployedDate = !isProduction;

  console.log('Showing BetaBar:', { showBetaBar });

  return {
    showBetaBar,
    showDeployedDate,
  };
};
