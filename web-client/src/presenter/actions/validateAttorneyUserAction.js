import { state } from 'cerebral';

/**
 * validates the attorney user data
 *
 * @param {object} providers the providers object
 * @param {object} providers.path the cerebral path which contains the next path in the sequence (path of success or error)
 * @param {Function} providers.get the cerebral get function
 * @returns {object} the next path based on if validation was successful or error
 */

export const validateAttorneyUserAction = ({
  applicationContext,
  get,
  path,
}) => {
  const { COUNTRY_TYPES } = applicationContext.getConstants();

  const user = get(state.form);

  // TODO: // Temp - update this
  user.section = user.role; // RACHAEL SAID THIS WAS COOL FOR NOW
  let userContactIsValid = true;
  const { contact } = user;

  if (
    !contact.address1 ||
    !contact.city ||
    !contact.postalCode ||
    !contact.phone
  ) {
    userContactIsValid = false;
  }

  if (user.contact.countryType === COUNTRY_TYPES.DOMESTIC) {
    if (!contact.state) {
      userContactIsValid = false;
    }
  } else {
    if (!contact.country) {
      userContactIsValid = false;
    }
  }

  if (
    !user.name ||
    !user.barNumber ||
    !user.email ||
    !user.role ||
    !userContactIsValid
  ) {
    return path.error({
      alertError: {
        message: 'Please enter all required fields to create an Attorney User.',
        title: 'Something was wrong',
      },
    });
  }

  return path.success();
};
