/**
 * Chooses a path to proceed with based on case sealed status and user role and association
 *
 * @param {object} providers the providers object
 * @param {object} providers.path provides execution path choices depending on the value of isSealed and user role & association
 * @param {object} providers.props the cerebral props object
 * @returns {object} continue path for the sequence
 */
export const showSealedToPublicCaseAction = ({ path, props }) => {
  const isAssociatedWithCase = props.isAssociated;
  const showSealedToPublicView =
    props.caseDetail.isSealed && !isAssociatedWithCase;

  return showSealedToPublicView ? path.yes() : path.no();
};
