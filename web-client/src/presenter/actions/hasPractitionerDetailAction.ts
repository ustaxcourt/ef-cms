import { isEmpty } from 'lodash';

export const hasPractitionerDetailAction = ({
  applicationContext,
  path,
  props,
}: ActionProps) => {
  const { practitionerDetail } = props;
  const isPublicUser = applicationContext.isPublicUser();

  if (isEmpty(practitionerDetail))
    return path.setResultsInState({ searchResults: [] });

  if (isPublicUser)
    return path.setResultsInState({
      searchResults: { practitioners: practitionerDetail, total: 1 },
    });

  return path.navigateToPractitionerDetails();
};
