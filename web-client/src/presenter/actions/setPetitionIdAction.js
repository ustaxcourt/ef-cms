import { find } from 'lodash';

/**
 * sets the docketNumber and  petition documentId which is used for routing to the newly created case.
 *
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @returns {object} docket number and documentId
 */
export const setPetitionIdAction = ({ props }) => {
  const { docketNumber } = props.caseDetail;
  const { documentId } = find(props.caseDetail.docketEntries, {
    documentType: 'Petition',
  });

  return {
    docketNumber,
    documentId,
  };
};
