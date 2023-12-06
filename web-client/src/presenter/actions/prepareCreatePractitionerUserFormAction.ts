import { state } from '@web-client/presenter/app.cerebral';

/**
 * prepare the form state to create a new practitioner user
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.store the cerebral store
 */
export const prepareCreatePractitionerUserFormAction = ({
  applicationContext,
  store,
}: ActionProps) => {
  const { COUNTRY_TYPES } = applicationContext.getConstants();

  store.set(state.form, {
    admissionsStatus: 'Active',
    contact: {
      countryType: COUNTRY_TYPES.DOMESTIC,
    },
  });
};
