import { state } from 'cerebral';

/**
 * checks if some docket numbers have already been selected
 *
 * @param {object} providers the providers object
 * @param {object} providers.get the cerebral get object
 * @param {object} providers.store the cerebral store object
 * @returns {any} the path to take if addedDocketNumbers is set or not
 */
export const hasAlreadyAddedDocketNumbersAction = ({ get, path }) => {
  let addedDocketNumbers = get(state.addedDocketNumbers);
  return addedDocketNumbers ? path.yes() : path.no();
};
