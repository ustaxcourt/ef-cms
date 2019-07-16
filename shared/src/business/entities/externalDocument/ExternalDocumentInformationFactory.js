const joi = require('joi-browser');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
} = require('../../../persistence/s3/getUploadPolicy');
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
    Object.assign(this, {
      attachments: rawProps.attachments,
      certificateOfService: rawProps.certificateOfService,
      certificateOfServiceDate: rawProps.certificateOfServiceDate,
      documentType: rawProps.documentType,
      eventCode: rawProps.eventCode,
      exhibits: rawProps.exhibits,
      freeText: rawProps.freeText,
      hasSecondarySupportingDocuments: rawProps.hasSecondarySupportingDocuments,
      hasSupportingDocuments: rawProps.hasSupportingDocuments,
      lodged: rawProps.lodged,
      objections: rawProps.objections,
      ordinalValue: rawProps.ordinalValue,
      partyPrimary: rawProps.partyPrimary,
      partyRespondent: rawProps.partyRespondent,
      partySecondary: rawProps.partySecondary,
      previousDocument: rawProps.previousDocument,
      primaryDocumentFile: rawProps.primaryDocumentFile,
      secondaryDocumentFile: rawProps.secondaryDocumentFile,
      secondarySupportingDocument: rawProps.secondarySupportingDocument,
      secondarySupportingDocumentFile: rawProps.secondarySupportingDocumentFile,
      secondarySupportingDocumentFreeText:
        rawProps.secondarySupportingDocumentFreeText,
      supportingDocument: rawProps.supportingDocument,
      supportingDocumentFile: rawProps.supportingDocumentFile,
      supportingDocumentFreeText: rawProps.supportingDocumentFreeText,
    });
  };

  let schema = {
    attachments: joi.boolean().required(),
    certificateOfService: joi.boolean().required(),
    exhibits: joi.boolean().required(),
    hasSupportingDocuments: joi.boolean().required(),
    primaryDocumentFile: joi.object().required(),
    primaryDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
  };

  let schemaOptionalItems = {
    certificateOfServiceDate: joi
      .date()
      .iso()
      .max('now'),
    hasSecondarySupportingDocuments: joi.boolean(),
    objections: joi.string(),
    partyPractitioner: joi.boolean(),
    partyPrimary: joi.boolean(),
    partyRespondent: joi.boolean(),
    partySecondary: joi.boolean(),
    secondaryDocumentFile: joi.object(),
    secondaryDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
    secondarySupportingDocument: joi.string(),
    secondarySupportingDocumentFile: joi.object(),
    secondarySupportingDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
    secondarySupportingDocumentFreeText: joi.string(),
    supportingDocument: joi.string(),
    supportingDocumentFile: joi.object(),
    supportingDocumentFileSize: joi
      .number()
      .optional()
      .min(1)
      .max(MAX_FILE_SIZE_BYTES)
      .integer(),
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
    partyPractitioner: 'Select a party.',
    partyPrimary: 'Select a party.',
    partyRespondent: 'Select a party.',
    partySecondary: 'Select a party.',
    primaryDocumentFile: 'A file was not selected.',
    primaryDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Primary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Primary Document file size is empty.',
    ],
    secondaryDocumentFile: 'A file was not selected.',
    secondaryDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Secondary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Secondary Document file size is empty.',
    ],
    secondarySupportingDocument:
      'Enter selection for Secondary Supporting Document.',
    secondarySupportingDocumentFile: 'A file was not selected.',
    secondarySupportingDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Secondary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Secondary Supporting Document file size is empty.',
    ],
    secondarySupportingDocumentFreeText: 'Please provide a value.',
    supportingDocument: 'Enter selection for Supporting Document.',
    supportingDocumentFile: 'A file was not selected.',
    supportingDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Secondary Document file size is empty.',
    ],
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
    if (schemaOptionalItems[itemName]) {
      schema[itemName] = schemaOptionalItems[itemName].required();
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
    /*makeRequired('supportingDocument');

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

    if (documentMetadata.secondaryDocumentFile) {
      makeRequired('hasSecondarySupportingDocuments');
    }

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
    }*/
  }

  if (
    documentMetadata.partyPrimary !== true &&
    documentMetadata.partySecondary !== true &&
    documentMetadata.partyRespondent !== true &&
    documentMetadata.partyPractitioner !== true
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
