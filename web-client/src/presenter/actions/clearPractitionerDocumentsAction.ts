import { state } from '@web-client/presenter/app.cerebral';

/**
 * clears the practitioner documentation array.
 * @param {object} providers the providers object
 * @param {object} providers.store the cerebral store object
 * @param {object} providers.props the cerebral props object containing the props.barNumber
 */
export const clearPractitionerDocumentsAction = ({ store }: ActionProps) => {
  store.unset(state.practitionerDocuments);
};
