import _ from 'lodash';

/**
 * sets the docketNumber and  petition documentId which is used for routing to the newly created case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @returns {object} docket number and documentId
 */
export const setPetitionIdAction = ({ props }) => {
  const docketNumber = props.caseDetail.docketNumber;
  const documentId = _.find(props.caseDetail.documents, {
    documentType: 'Petition',
  }).documentId;

  return {
    docketNumber,
    documentId,
  };
};
