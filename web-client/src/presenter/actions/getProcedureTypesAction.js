/**
 * fetch the procedure types that can be used when starting a case (Regular, Small)
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getInternalUsers use case
 * @returns {object} the list of procedureTypes
 */
export const getProcedureTypesAction = async ({ applicationContext }) => {
  const procedureTypes = await applicationContext
    .getUseCases()
    .getProcedureTypesInteractor({
      applicationContext,
    });
  return { procedureTypes };
};
