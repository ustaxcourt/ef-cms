/**
 * will take a different path depending on the tab selected on practitioner info page.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context used for getting the getUser use case
 * @param {Function} providers.props the cerebral props object used for getting the props.user
 * @returns {object} the user
 */
export const handlePractitionerInformationTabSelectAction = ({
  path,
  props,
}: ActionProps) => {
  if (props.tabName === 'practitioner-documentation') {
    return path.documentation();
  } else {
    return path.details();
  }
};
