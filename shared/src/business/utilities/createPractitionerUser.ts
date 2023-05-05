import { Practitioner } from '../entities/Practitioner';

/**
 * Create a new practitioner
 *
 * @param {object} providers the providers object
 * @param {object} providers.applicationContext the application context
 * @param {object} providers.user the user data
 * @returns {object} new practitioner user
 */
export const createPractitionerUser = async ({ applicationContext, user }) => {
  const barNumber =
    user.barNumber ||
    (await applicationContext.barNumberGenerator.createBarNumber({
      applicationContext,
      initials:
        user.lastName.charAt(0).toUpperCase() +
        user.firstName.charAt(0).toUpperCase(),
    }));

  return new Practitioner({
    ...user,
    barNumber,
    userId: applicationContext.getUniqueId(),
  })
    .validate()
    .toRawObject();
};
