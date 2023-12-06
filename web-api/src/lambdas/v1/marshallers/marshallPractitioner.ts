import { marshallContact } from './marshallContact';

/**
 * The returned object is specified by the v1 API and any changes to these properties
 * beyond additions must be accompanied by a version increase.
 *
 * @param {object} practitionerObject the most up-to-date representation of a practitioner
 * @returns {object} the v1 representation of a practitioner
 */
export const marshallPractitioner = practitionerObject => {
  return {
    barNumber: practitionerObject.barNumber,
    contact: practitionerObject.contact
      ? marshallContact(practitionerObject.contact)
      : undefined,
    email: practitionerObject.email,
    name: practitionerObject.name,
    serviceIndicator: practitionerObject.serviceIndicator,
  };
};
