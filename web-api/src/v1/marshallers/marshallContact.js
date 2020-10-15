// The returned object is specified by the v1 API and should not change
// without changing the API version.
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
    state: contactObject.state,
  };
};
