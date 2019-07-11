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
  let entityConstructor = function(rawPropsParam) {
    Object.assign(this, {
      addToCoversheet: rawPropsParam.addToCoversheet,
      additionalInfo: rawPropsParam.additionalInfo,
      additionalInfo2: rawPropsParam.additionalInfo2,
      attachments: rawPropsParam.attachments,
      certificateOfService: rawPropsParam.certificateOfService,
      certificateOfServiceDate: rawPropsParam.certificateOfServiceDate,
      dateReceived: rawPropsParam.dateReceived,
      documentType: rawPropsParam.documentType,
      eventCode: rawPropsParam.eventCode,
      exhibits: rawPropsParam.exhibits,
      freeText: rawPropsParam.freeText,
      hasSupportingDocuments: rawPropsParam.hasSupportingDocuments,
      lodged: rawPropsParam.lodged,
      objections: rawPropsParam.objections,
      ordinalValue: rawPropsParam.ordinalValue,
      partyPrimary: rawPropsParam.partyPrimary,
      partyRespondent: rawPropsParam.partyRespondent,
      partySecondary: rawPropsParam.partySecondary,
      previousDocument: rawPropsParam.previousDocument,
      primaryDocumentFile: rawPropsParam.primaryDocumentFile,
      secondaryDocumentFile: rawPropsParam.secondaryDocumentFile,
    });
    const { secondaryDocument } = rawPropsParam;
    if (secondaryDocument) {
      this.secondaryDocument = ExternalDocumentFactory.get(secondaryDocument);
    }
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
    eventCode: joi.string().required(),
    exhibits: joi.boolean(),
    hasSupportingDocuments: joi.boolean(),
    lodged: joi.boolean(),
    primaryDocumentFile: joi.object().required(),
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
    partyRespondent: joi.boolean().required(),
    partySecondary: joi.boolean().required(),
    secondaryDocumentFile: joi.object().required(),
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
    eventCode: 'Select a document type.',
    exhibits: 'Enter selection for Exhibits.',
    hasSupportingDocuments: 'Enter selection for Supporting Documents.',
    lodged: 'Enter selection for Filing Status.',
    objections: 'Enter selection for Objections.',
    partyPrimary: 'Select a filing party.',
    partyRespondent: 'Select a filing party.',
    partySecondary: 'Select a filing party.',
    primaryDocumentFile: 'A file was not selected.',
    secondaryDocumentFile: 'A file was not selected.',
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
    rawProps.scenario &&
    rawProps.scenario.toLowerCase().trim() === 'nonstandard h'
  ) {
    addToSchema('secondaryDocumentFile');
  }

  let partyPractitioner = false;
  if (Array.isArray(rawProps.practitioner)) {
    rawProps.practitioner.forEach(practitioner => {
      if (practitioner.partyPractitioner) {
        partyPractitioner = true;
      }
    });
  }

  if (
    rawProps.partyPrimary !== true &&
    rawProps.partySecondary !== true &&
    rawProps.partyRespondent !== true &&
    partyPractitioner !== true
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
