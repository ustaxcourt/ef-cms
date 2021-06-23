/**
 * The returned object is specified by the v2 API and any changes to these properties
 * beyond additions must be accompanied by a version increase.
 *
 * @param {object} contactObject the most up-to-date representation of a contact
 * @returns {object} the v2 representation of a contact
 */
exports.marshallContact = contactObject => {
  return {
    address1: contactObject.address1,
    address2: contactObject.address2,
    address3: contactObject.address3,
    city: contactObject.city,
    email: contactObject.email,
    name: contactObject.name,
    phone: contactObject.phone,
    postalCode: contactObject.postalCode,
    serviceIndicator: contactObject.serviceIndicator,
    state: contactObject.state,
  };
};
