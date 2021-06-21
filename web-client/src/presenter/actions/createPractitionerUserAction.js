import { state } from 'cerebral';

/**
 * creates a practitioner user from the given form data
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the applicationContext
 * @param {Function} providers.get the cerebral get function
 * @param {object} providers.path the next object in the path
 * @param {object} providers.props the props passed in to the action
 * @returns {object} path execution results
 */
export const createPractitionerUserAction = async ({
  applicationContext,
  get,
  path,
  props,
}) => {
  const practitioner = get(state.form);
  practitioner.admissionsDate = props.computedDate;

  try {
    const practitionerUser = await applicationContext
      .getUseCases()
      .createPractitionerUserInteractor(applicationContext, {
        user: practitioner,
      });
    return path.success({
      alertSuccess: {
        message: 'Practitioner added.',
      },
      barNumber: practitionerUser.barNumber,
      practitionerUser,
    });
  } catch (err) {
    return path.error();
  }
};
