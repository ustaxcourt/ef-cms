const { marshallContact } = require('./marshallContact');

// The returned object is specified by the v1 API and should not change
// without changing the API version.
exports.marshallPractitioner = practitionerObject => {
  return {
    barNumber: practitionerObject.barNumber,
    contact: marshallContact(practitionerObject.contact),
    email: practitionerObject.email,
    name: practitionerObject.name,
    serviceIndicator: practitionerObject.serviceIndicator,
  };
};
