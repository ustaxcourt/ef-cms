/**
 * fetch the procedure types that can be used when starting a case (Regular, Small)
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the getInternalUsers use case
 * @returns {Object} the list of procedureTypes
 */
export default async ({ applicationContext }) => {
  const procedureTypes = await applicationContext
    .getUseCases()
    .getProcedureTypes({
      applicationContext,
    });
  return { procedureTypes };
};
