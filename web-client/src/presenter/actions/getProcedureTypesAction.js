import { state } from 'cerebral';

/**
 * fetch the procedure types that can be used when starting a case (Regular, Small)
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext the application context used for getting the getInternalUsers use case
 * @param {Function} providers.get the cerebral get function  application context used for getting the getInternalUsers use case
 * @returns {Object} the list of procedureTypes
 */
export default async ({ applicationContext, get }) => {
  const procedureTypes = await applicationContext
    .getUseCases()
    .getProcedureTypes({
      userId: get(state.user.userId),
    });
  return { procedureTypes };
};
