import { state } from 'cerebral';
import { Case } from '../../../../shared/src/business/entities/Case';

/**
 * returns the path based on what the documentType is for the selected state.document.documentType.
 *
 * @param {Object} providers the providers object
 * @param {Function} providers.get needed for getting the state.document.documentType
 * @param {Object} providers.path the cerebral path object that contains the next possible sequence path to invoke
 * @returns {Object} the next path in the sequence which should be ran
 */
export const getDocumentTypeAction = async ({ get, path }) => {
  const documentType = get(state.document.documentType);
  switch (documentType) {
    case Case.documentTypes.answer:
      return path['answer']();
    case Case.documentTypes.stipulatedDecision:
      return path['stipulatedDecision']();
    default:
      return path['generic']();
  }
};
