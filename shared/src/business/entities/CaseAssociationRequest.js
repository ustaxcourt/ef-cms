const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { includes } = require('lodash');

/**
 * @param rawProps
 * @constructor
 */
function CaseAssociationRequest(rawProps) {
  let entityConstructor = function(rawProps) {
    Object.assign(this, rawProps);
  };

  let schema = {
    certificateOfService: joi.boolean().required(),
    documentTitle: joi.string().required(),
    documentType: joi.string().required(),
    eventCode: joi.string().required(),
    primaryDocumentFile: joi.object().required(),
    scenario: joi.boolean().required(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now')
      .required(),
    objections: joi.string().required(),
    partyPrimary: joi
      .boolean()
      .invalid(false)
      .required(),
    partySecondary: joi
      .boolean()
      .invalid(false)
      .required(),
  };

  let errorToMessageMap = {
    certificateOfService: 'Enter selection for Certificate of Service.',
    certificateOfServiceDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'Certificate of Service date is in the future. Please enter a valid date.',
      },
      'Enter a Certificate of Service Date.',
    ],
    documentTitle: 'Select a document.',
    documentType: 'Select a document.',
    objections: 'Enter selection for Objections.',
    partyPrimary: 'Select a party.',
    partySecondary: 'Select a party.',
    primaryDocumentFile: 'A file was not selected.',
  };

  let customValidate;

  const makeRequired = itemName => {
    schema[itemName] = schemaOptionalItems[itemName];
  };

  const requireObjectionDocuments = ['Substitution of Counsel'];

  if (rawProps.certificateOfService === true) {
    makeRequired('certificateOfServiceDate');
  }

  if (includes(requireObjectionDocuments, rawProps.documentType)) {
    makeRequired('objections');
  }

  if (rawProps.partyPrimary !== true && rawProps.partySecondary !== true) {
    makeRequired('partyPrimary');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    customValidate,
    errorToMessageMap,
  );

  return new entityConstructor(rawProps);
}

module.exports = { CaseAssociationRequest };
