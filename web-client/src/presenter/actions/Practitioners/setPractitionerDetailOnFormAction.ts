import { FORMATS } from '../../../../../shared/src/business/utilities/DateHandler';
import { state } from 'cerebral';

/**
 * sets props.practitionerDetail on state.form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setPractitionerDetailOnFormAction = ({
  applicationContext,
  props,
  store,
}: ActionProps) => {
  store.set(state.form, props.practitionerDetail);
  store.set(state.form.originalEmail, props.practitionerDetail.email);

  const admissionsDate = applicationContext
    .getUtilities()
    .prepareDateFromString(
      props.practitionerDetail.admissionsDate,
      FORMATS.YYYYMMDD,
    );

  const deconstructedDate = applicationContext
    .getUtilities()
    .deconstructDate(admissionsDate);

  if (deconstructedDate) {
    store.set(state.form.month, deconstructedDate.month);
    store.set(state.form.day, deconstructedDate.day);
    store.set(state.form.year, deconstructedDate.year);
  }
};
