/**
 * gets today's opinions
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @returns {Promise} a list of today's opinion documents
 */
export const getTodaysOpinionsAction = async ({ applicationContext }) => {
  const todaysOpinions = await applicationContext
    .getUseCases()
    .getTodaysOpinionsInteractor(applicationContext);

  return { todaysOpinions };
};
