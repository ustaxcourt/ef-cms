import { state } from '@web-client/presenter/app.cerebral';

/**
 * fetches all documents associated with the practitioner.
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext needed for getting the getPractitionerDetail use case
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 * @returns {object} containing practitionerDetail
 */
export const getPractitionerDocumentsAction = async ({
  applicationContext,
  get,
}: ActionProps) => {
  const { barNumber } = get(state.practitionerDetail);

  const practitionerDocuments = await applicationContext
    .getUseCases()
    .getPractitionerDocumentsInteractor(applicationContext, {
      barNumber,
    });

  return { practitionerDocuments };
};
