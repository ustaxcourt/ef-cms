import { state } from 'cerebral';

/**
 * sets props.practitionerDetail on state.form
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setPractitionerDetailOnFormAction = ({
  applicationContext,
  props,
  store,
}) => {
  store.set(state.form, props.practitionerDetail);
  store.set(state.form.originalEmail, props.practitionerDetail.email);

  const admissionsDate = applicationContext
    .getUtilities()
    .prepareDateFromString(
      props.practitionerDetail.admissionsDate,
      'YYYY/MM/DD',
    );
  if (
    admissionsDate &&
    admissionsDate.toDate() instanceof Date &&
    !isNaN(admissionsDate.toDate())
  ) {
    store.set(state.form.month, admissionsDate.format('M'));
    store.set(state.form.day, admissionsDate.format('D'));
    store.set(state.form.year, admissionsDate.format('YYYY'));
  }
};
