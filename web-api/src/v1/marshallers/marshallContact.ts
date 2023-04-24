/**
 * The returned object is specified by the v1 API and any changes to these properties
 * beyond additions must be accompanied by a version increase.
 *
 * @param {object} contactObject the most up-to-date representation of a contact
 * @returns {object} the v1 representation of a contact
 */
export const marshallContact = contactObject => {
  return {
    address1: contactObject.address1,
    address2: contactObject.address2,
    address3: contactObject.address3,
    city: contactObject.city,
    contactType: contactObject.contactType,
    email: contactObject.email,
    name: contactObject.name,
    phone: contactObject.phone,
    postalCode: contactObject.postalCode,
    state: contactObject.state,
  };
};
