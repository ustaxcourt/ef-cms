/**
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.initials the initials preceding the generated number
 * @returns {string} the generated bar number
 */
export const createBarNumber = async ({
  applicationContext,
  initials,
}: {
  applicationContext: IApplicationContext;
  initials: string;
}) => {
  const id = await applicationContext.getPersistenceGateway().incrementCounter({
    applicationContext,
    key: 'barNumberCounter',
  });
  const padded = id.toString(10).padStart(3, '0');
  const lastTwo = applicationContext.getUtilities().formatNow('YEAR_TWO_DIGIT');

  return `${initials}${lastTwo}${padded}`;
};
