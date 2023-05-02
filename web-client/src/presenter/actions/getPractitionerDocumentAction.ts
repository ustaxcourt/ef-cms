/**
 * Fetches the practitioner document
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 * @returns {object} containing practitionerDetail
 */

export const getPractitionerDocumentAction = async ({
  applicationContext,
  props,
}: ActionProps) => {
  const { barNumber, practitionerDocumentFileId } = props;

  const practitionerDocument = await applicationContext
    .getUseCases()
    .getPractitionerDocumentInteractor(applicationContext, {
      barNumber,
      practitionerDocumentFileId,
    });

  return { practitionerDocument };
};
