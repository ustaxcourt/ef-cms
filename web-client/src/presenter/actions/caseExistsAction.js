import { NotFoundError } from '../errors/NotFoundError';

/**
 * Checks for existence of a case using the getCase use case using the props.docketNumber
 *
 * @param {Object} providers the providers object
 * @param {Object} providers.applicationContext needed for getting the getCase use case
 * @param {Function} providers.path provides execution path choices depending on success of search
 * @param {Object} providers.props the cerebral props object containing props.docketNumber
 * @returns {Object} contains the caseDetail returned from the use case
 */
export const caseExistsAction = async ({ applicationContext, path, props }) => {
  try {
    await applicationContext.getUseCases().getCase({
      applicationContext,
      docketNumber: props.caseId,
    });
  } catch (e) {
    if (e instanceof NotFoundError) {
      return path.error();
    } else {
      throw e;
    }
  }
  return path.success();
};
