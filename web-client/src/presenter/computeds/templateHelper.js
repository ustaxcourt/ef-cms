export const templateHelper = (get, applicationContext) => {
  const isProduction = applicationContext.getEnvironment().stage === 'prod';

  const showBetaBar = !isProduction;
  const showDeployedDate = !isProduction;

  return {
    showBetaBar,
    showDeployedDate,
  };
};
