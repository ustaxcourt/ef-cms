const joi = require('joi-browser');
const {
  ExternalDocumentFactory,
} = require('../externalDocument/ExternalDocumentFactory');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { includes, omit } = require('lodash');

/**
 * @param rawProps
 * @constructor
 */
function DocketEntryFactory(rawProps) {
  let entityConstructor = function(rawProps) {
    Object.assign(this, rawProps);
  };

  let schema = {
    addToCoversheet: joi.boolean(),
    additionalInfo: joi.string(),
    additionalInfo2: joi.string(),
    attachments: joi.boolean(),
    certificateOfService: joi.boolean(),
    dateReceived: joi
      .date()
      .iso()
      .max('now')
      .required(),
    eventCode: joi.string(),
    exhibits: joi.boolean(),
    hasSupportingDocuments: joi.boolean(),
    lodged: joi.boolean().required(),
    primaryDocumentFile: joi.object().required(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now')
      .required(),
    objections: joi.string(),
    partyPrimary: joi.boolean().required(),
    partyRespondent: joi.boolean().required(),
    partySecondary: joi.boolean().required(),
  };

  let errorToMessageMap = {
    attachments: 'Enter selection for Attachments.',
    certificateOfService: 'Enter selection for Certificate of Service.',
    certificateOfServiceDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'Certificate of Service date is in the future. Please enter a valid date.',
      },
      'Enter a Certificate of Service Date.',
    ],
    dateReceived: [
      {
        contains: 'must be less than or equal to',
        message: 'Received date is in the future. Please enter a valid date.',
      },
      'Enter date received.',
    ],
    eventCode: 'Select a document.',
    exhibits: 'Enter selection for Exhibits.',
    hasSupportingDocuments: 'Enter selection for Supporting Documents.',
    lodged: 'Enter selection for Filing Status.',
    partyPrimary: 'Select a filing party.',
    partyRespondent: 'Select a filing party.',
    partySecondary: 'Select a filing party.',
    primaryDocumentFile: 'A file was not selected.',
  };

  let customValidate;

  const addToSchema = itemName => {
    schema[itemName] = schemaOptionalItems[itemName];
  };

  const exDoc = ExternalDocumentFactory.get(rawProps);

  const externalDocumentOmit = ['category'];

  const docketEntryExternalDocumentSchema = omit(
    exDoc.getSchema(),
    externalDocumentOmit,
  );
  schema = { ...schema, ...docketEntryExternalDocumentSchema };

  const docketEntryExternalDocumentErrorToMessageMap = omit(
    exDoc.getErrorToMessageMap(),
    externalDocumentOmit,
  );
  errorToMessageMap = {
    ...errorToMessageMap,
    ...docketEntryExternalDocumentErrorToMessageMap,
  };

  if (rawProps.certificateOfService === true) {
    addToSchema('certificateOfServiceDate');
  }

  if (
    rawProps.category === 'Motion' ||
    includes(
      [
        'Motion to Withdraw Counsel',
        'Motion to Withdraw As Counsel',
        'Application to Take Deposition',
      ],
      rawProps.documentType,
    )
  ) {
    addToSchema('objections');
  }
  if (
    rawProps.partyPrimary !== true &&
    rawProps.partySecondary !== true &&
    rawProps.partyRespondent !== true &&
    rawProps.partyPractitioner !== true
  ) {
    addToSchema('partyPrimary');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    customValidate,
    errorToMessageMap,
  );

  return new entityConstructor(rawProps);
}

module.exports = { DocketEntryFactory };
