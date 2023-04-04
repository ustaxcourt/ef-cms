/**
 * gets opinion pamphlets
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @returns {Promise} a list of opinion pamphlet documents
 */
export const getOpinionPamphletsAction = async ({ applicationContext }) => {
  const opinionPamphlets = await applicationContext
    .getUseCases()
    .getOpinionPamphletsInteractor(applicationContext);
  return { opinionPamphlets };
};
