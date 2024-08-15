import { state } from '@web-client/presenter/app.cerebral';

import { ClientApplicationContext } from '@web-client/applicationContext';
import { Get } from '../../utilities/cerebralWrapper';
export const templateHelper = (
  get: Get,
  applicationContext: ClientApplicationContext,
): any => {
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
