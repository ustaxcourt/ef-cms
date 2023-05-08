import { find } from 'lodash';

/**
 * gets the docketNumber and  petition docketEntryId which is used for routing to the newly created case.
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.caseDetail
 * @returns {object} docket number and docketEntryId
 */
export const getPetitionIdAction = ({ props }: ActionProps) => {
  const { docketNumber } = props.caseDetail;
  const { docketEntryId } = find(props.caseDetail.docketEntries, {
    documentType: 'Petition',
  });

  return {
    docketEntryId,
    docketNumber,
  };
};
