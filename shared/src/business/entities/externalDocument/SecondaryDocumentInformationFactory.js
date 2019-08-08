const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { includes } = require('lodash');
const { makeRequiredHelper } = require('./externalDocumentHelpers');

/**
 *
 * @constructor
 */
function SecondaryDocumentInformationFactory() {}

/**
 *
 * @param documentMetadata
 */
SecondaryDocumentInformationFactory.get = documentMetadata => {
  let entityConstructor = function(rawProps) {
    Object.assign(this, {
      attachments: rawProps.attachments,
      category: rawProps.category,
      certificateOfService: rawProps.certificateOfService,
      certificateOfServiceDate: rawProps.certificateOfServiceDate,
      documentType: rawProps.documentType,
      objections: rawProps.objections,
      secondaryDocumentFile: rawProps.secondaryDocumentFile,
    });
  };

  let schema = {};

  let schemaOptionalItems = {
    attachments: joi.boolean(),
    certificateOfService: joi.boolean(),
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now'),
    objections: joi.string(),
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
      'Enter date for Certificate of Service.',
    ],
    objections: 'Enter selection for Objections.',
  };

  const makeRequired = itemName => {
    makeRequiredHelper({
      itemName,
      schema,
      schemaOptionalItems,
    });
  };

  if (documentMetadata.secondaryDocumentFile) {
    makeRequired('attachments');
    makeRequired('certificateOfService');

    if (documentMetadata.certificateOfService === true) {
      makeRequired('certificateOfServiceDate');
    }

    if (
      documentMetadata.category === 'Motion' ||
      includes(
        [
          'Motion to Withdraw Counsel',
          'Motion to Withdraw As Counsel',
          'Application to Take Deposition',
        ],
        documentMetadata.documentType,
      )
    ) {
      makeRequired('objections');
    }
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    undefined,
    errorToMessageMap,
  );

  return new entityConstructor(documentMetadata);
};

module.exports = { SecondaryDocumentInformationFactory };
