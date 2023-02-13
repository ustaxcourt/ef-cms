/**
 * Fetches the details about a practitioner
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 * @returns {object} containing practitionerDetail
 */

export const getPractitionerDetailAction = async ({
  applicationContext,
  props,
}) => {
  const { barNumber } = props;

  const practitionerDetail = await applicationContext
    .getUseCases()
    .getPractitionerByBarNumberInteractor(applicationContext, {
      barNumber,
    });

  return { practitionerDetail };
};
