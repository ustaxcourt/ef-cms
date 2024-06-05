import { isEmpty } from 'lodash';

/**
 * returns the next path based on whether props.practitionerDetail is set
 * @param {object} providers the providers object
 * @param {object} providers.props the cerebral props object containing the props.practitionerDetail
 * @param {object} providers.path the cerebral store used for setting the state.practitionerDetail
 * @returns {Function} the next path in the sequence
 */
export const hasPractitionerDetailAction = ({ path, props }: ActionProps) => {
  const { isPublicUser, practitionerDetail } = props;

  if (isEmpty(practitionerDetail))
    return path.setResultsInState({ searchResults: [] });

  if (isPublicUser)
    return path.setResultsInState({
      searchResults: { practitioners: practitionerDetail, total: 1 },
    });

  return path.navigateToPractitionerDetails();
};
