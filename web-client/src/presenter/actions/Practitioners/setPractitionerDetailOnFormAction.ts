import { state } from '@web-client/presenter/app.cerebral';

/**
 * sets props.practitionerDetail on state.form
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.props the cerebral props object
 * @param {object} providers.store the cerebral store
 */
export const setPractitionerDetailOnFormAction = ({
  props,
  store,
}: ActionProps) => {
  store.set(state.form, props.practitionerDetail);
  store.set(state.form.originalEmail, props.practitionerDetail.email);
};
