const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../utilities/JoiValidationDecorator');
const { includes } = require('lodash');
const { replaceBracketed } = require('../utilities/getDocumentTitle');

/**
 * @param rawProps
 * @constructor
 */
function CaseAssociationRequest(rawProps) {
  let entityConstructor = function(rawProps) {
    rawProps.partyPractitioner = true;
    Object.assign(this, rawProps);
  };

  entityConstructor.prototype.getDocumentTitle = function(
    contactPrimaryName,
    contactSecondaryName,
  ) {
    const petitionerNamesArray = [];
    if (rawProps.representingPrimary) {
      petitionerNamesArray.push(contactPrimaryName);
    }
    if (rawProps.representingSecondary) {
      petitionerNamesArray.push(contactSecondaryName);
    }
    let petitionerNames;
    if (petitionerNamesArray.length > 1) {
      petitionerNames = 'Petrs. ';
    } else {
      petitionerNames = 'Petr. ';
    }
    petitionerNames += petitionerNamesArray.join(' & ');

    return replaceBracketed(this.documentTitleTemplate, petitionerNames);
  };

  let schema = {
    certificateOfService: joi.boolean().required(),
    documentTitle: joi.string().optional(),
    documentTitleTemplate: joi.string().required(),
    documentType: joi.string().required(),
    eventCode: joi.string().required(),
    primaryDocumentFile: joi.object().required(),
    scenario: joi.string().required(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now')
      .required(),
    objections: joi.string().required(),
    representingPrimary: joi
      .boolean()
      .invalid(false)
      .required(),
    representingSecondary: joi
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
    documentTitleTemplate: 'Select a document.',
    documentType: 'Select a document.',
    eventCode: 'Select a document.',
    objections: 'Enter selection for Objections.',
    primaryDocumentFile: 'A file was not selected.',
    representingPrimary: 'Select a party.',
    representingSecondary: 'Select a party.',
    scenario: 'Select a document.',
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

  if (
    rawProps.representingPrimary !== true &&
    rawProps.representingSecondary !== true
  ) {
    makeRequired('representingPrimary');
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
