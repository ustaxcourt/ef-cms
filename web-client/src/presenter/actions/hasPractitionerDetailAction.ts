import { isEmpty } from 'lodash';

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
