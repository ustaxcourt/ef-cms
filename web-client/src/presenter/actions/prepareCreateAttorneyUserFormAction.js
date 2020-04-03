import { state } from 'cerebral';

/**
 * prepare the form state to create a new attorney user
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {object} providers.store the cerebral store
 */
export const prepareCreateAttorneyUserFormAction = ({
  applicationContext,
  store,
}) => {
  const { COUNTRY_TYPES } = applicationContext.getConstants();

  store.set(state.form, {
    contact: {
      countryType: COUNTRY_TYPES.DOMESTIC,
    },
  });
};
