const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { includes } = require('lodash');

/**
 *
 * @constructor
 */
function ExternalDocumentInformationFactory() {}

/**
 *
 * @param documentMetadata
 */
ExternalDocumentInformationFactory.get = documentMetadata => {
  let entityConstructor = function(rawProps) {
    Object.assign(this, rawProps);
  };

  let schema = {
    attachments: joi.boolean().required(),
    certificateOfService: joi.boolean().required(),
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now'),
    exhibits: joi.boolean().required(),
    hasSecondarySupportingDocuments: joi.boolean(),
    hasSupportingDocuments: joi.boolean().required(),
    objections: joi.string(),
    partyPrimary: joi.boolean(),
    partyRespondent: joi.boolean(),
    partySecondary: joi.boolean(),
    primaryDocumentFile: joi.object().required(),
    secondaryDocumentFile: joi.object(),
    secondarySupportingDocument: joi.string(),
    secondarySupportingDocumentFile: joi.object(),
    secondarySupportingDocumentFreeText: joi.string(),
    supportingDocument: joi.string(),
    supportingDocumentFile: joi.object(),
    supportingDocumentFreeText: joi.string(),
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
    exhibits: 'Enter selection for Exhibits.',
    hasSecondarySupportingDocuments:
      'Enter selection for Secondary Supporting Documents.',
    hasSupportingDocuments: 'Enter selection for Supporting Documents.',
    objections: 'Enter selection for Objections.',
    partyPrimary: 'Select a party.',
    partyRespondent: 'Select a party.',
    partySecondary: 'Select a party.',
    primaryDocumentFile: 'A file was not selected.',
    secondaryDocumentFile: 'A file was not selected.',
    secondarySupportingDocument:
      'Enter selection for Secondary Supporting Document.',
    secondarySupportingDocumentFile: 'A file was not selected.',
    secondarySupportingDocumentFreeText: 'Please provide a value.',
    supportingDocument: 'Enter selection for Supporting Document.',
    supportingDocumentFile: 'A file was not selected.',
    supportingDocumentFreeText: 'Please provide a value.',
  };

  let customValidate;

  const addProperty = (itemName, itemSchema, itemErrorMessage) => {
    schema[itemName] = itemSchema;
    if (itemErrorMessage) {
      errorToMessageMap[itemName] = itemErrorMessage;
    }
  };

  const makeRequired = itemName => {
    if (schema[itemName]) {
      schema[itemName] = schema[itemName].required();
    }
  };

  const supportingDocumentFreeTextCategories = [
    'Affidavit in Support',
    'Declaration in Support',
    'Unsworn Declaration under Penalty of Perjury in Support',
  ];
  const supportingDocumentFileCategories = [
    'Memorandum in Support',
    'Brief in Support',
    'Affidavit in Support',
    'Declaration in Support',
    'Unsworn Declaration under Penalty of Perjury in Support',
  ];

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

  if (documentMetadata.hasSupportingDocuments === true) {
    makeRequired('supportingDocument');

    if (
      includes(
        supportingDocumentFreeTextCategories,
        documentMetadata.supportingDocument,
      )
    ) {
      makeRequired('supportingDocumentFreeText');
    }

    if (
      includes(
        supportingDocumentFileCategories,
        documentMetadata.supportingDocument,
      )
    ) {
      makeRequired('supportingDocumentFile');
    }
  }

  if (documentMetadata.scenario.toLowerCase().trim() === 'nonstandard h') {
    if (
      includes(
        documentMetadata.documentType,
        'Motion for Leave to File Out of Time',
      )
    ) {
      makeRequired('secondaryDocumentFile');
    }

    makeRequired('hasSecondarySupportingDocuments');

    if (documentMetadata.hasSecondarySupportingDocuments === true) {
      makeRequired('secondarySupportingDocument');

      if (
        includes(
          supportingDocumentFreeTextCategories,
          documentMetadata.secondarySupportingDocument,
        )
      ) {
        makeRequired('secondarySupportingDocumentFreeText');
      }

      if (
        includes(
          supportingDocumentFileCategories,
          documentMetadata.secondarySupportingDocument,
        )
      ) {
        makeRequired('secondarySupportingDocumentFile');
      }
    }
  }

  if (
    documentMetadata.partyPrimary !== true &&
    documentMetadata.partySecondary !== true &&
    documentMetadata.partyRespondent !== true
  ) {
    addProperty(
      'partyPrimary',
      joi
        .boolean()
        .invalid(false)
        .required(),
    );
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    customValidate,
    errorToMessageMap,
  );

  return new entityConstructor(documentMetadata);
};

module.exports = { ExternalDocumentInformationFactory };
