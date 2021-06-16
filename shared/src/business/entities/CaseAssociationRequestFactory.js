const joi = require('joi');
const {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  OBJECTIONS_OPTIONS,
  SCENARIOS,
} = require('./EntityConstants');
const {
  JoiValidationConstants,
} = require('../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../utilities/JoiValidationDecorator');
const {
  SupportingDocumentInformationFactory,
} = require('./externalDocument/SupportingDocumentInformationFactory');
const {
  VALIDATION_ERROR_MESSAGES,
} = require('./externalDocument/ExternalDocumentInformationFactory');
const { replaceBracketed } = require('../utilities/replaceBracketed');

/**
 * Case Association Request Factory entity
 *
 * @param {object} rawProps the raw case association request data
 * @constructor
 */
function CaseAssociationRequestFactory(rawProps) {
  /**
   *
   */
  function entityConstructor() {}
  entityConstructor.prototype.init = function init(rawPropsParam) {
    this.attachments = rawPropsParam.attachments;
    this.certificateOfService = rawPropsParam.certificateOfService;
    this.certificateOfServiceDate = rawPropsParam.certificateOfServiceDate;
    this.documentTitle = rawPropsParam.documentTitle;
    this.documentTitleTemplate = rawPropsParam.documentTitleTemplate;
    this.documentType = rawPropsParam.documentType;
    this.eventCode = rawPropsParam.eventCode;
    this.hasSupportingDocuments = rawPropsParam.hasSupportingDocuments;
    this.objections = rawPropsParam.objections;
    this.partyPrivatePractitioner = rawPropsParam.partyPrivatePractitioner;
    this.partyIrsPractitioner = rawPropsParam.partyIrsPractitioner;
    this.primaryDocumentFile = rawPropsParam.primaryDocumentFile;
    this.filers = rawPropsParam.filers || [];
    this.scenario = rawPropsParam.scenario;
    this.supportingDocuments = rawPropsParam.supportingDocuments;

    if (this.supportingDocuments) {
      this.supportingDocuments = this.supportingDocuments.map(item => {
        return SupportingDocumentInformationFactory.get(
          item,
          CaseAssociationRequestFactory.VALIDATION_ERROR_MESSAGES,
        );
      });
    }
  };

  const documentWithAttachments = [
    'Motion to Substitute Parties and Change Caption',
    'Notice of Intervention',
    'Notice of Election to Participate',
    'Notice of Election to Intervene',
  ].includes(rawProps.documentType);

  const documentWithObjections = [
    'Substitution of Counsel',
    'Motion to Substitute Parties and Change Caption',
  ].includes(rawProps.documentType);

  const documentWithSupportingDocuments = [
    'Motion to Substitute Parties and Change Caption',
  ].includes(rawProps.documentType);

  const documentWithConcatentatedPetitionerNames = [
    'Entry of Appearance',
    'Limited Entry of Appearance',
    'Substitution of Counsel',
  ].includes(rawProps.documentType);

  entityConstructor.prototype.getDocumentTitle = function (petitioners) {
    let petitionerNames;
    if (rawProps.partyIrsPractitioner) {
      petitionerNames = 'Respondent';
    } else {
      const petitionerNamesArray = this.filers.map(
        contactId => petitioners.find(p => p.contactId === contactId).name,
      );

      if (petitionerNamesArray.length > 1) {
        petitionerNames = 'Petrs. ';
      } else {
        petitionerNames = 'Petr. ';
      }
      petitionerNames += petitionerNamesArray.join(' & ');
    }

    if (documentWithConcatentatedPetitionerNames) {
      return replaceBracketed(rawProps.documentTitleTemplate, petitionerNames);
    } else {
      return rawProps.documentTitleTemplate;
    }
  };

  let schema = {
    certificateOfService: joi.boolean().required(),
    documentTitle: JoiValidationConstants.STRING.max(500).optional(),
    documentTitleTemplate: JoiValidationConstants.STRING.max(500).required(),
    documentType: JoiValidationConstants.STRING.valid(
      ...ALL_DOCUMENT_TYPES,
    ).required(),
    eventCode: JoiValidationConstants.STRING.valid(
      ...ALL_EVENT_CODES,
    ).required(),
    partyIrsPractitioner: joi.boolean().optional(),
    partyPrivatePractitioner: joi.boolean().optional(),
    primaryDocumentFile: joi.object().required(), // object of type File
    scenario: JoiValidationConstants.STRING.valid(...SCENARIOS).required(),
  };

  let schemaOptionalItems = {
    attachments: joi.boolean().required(),
    certificateOfServiceDate:
      JoiValidationConstants.ISO_DATE.max('now').required(),
    filers: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required(),
    hasSupportingDocuments: joi.boolean().required(),
    objections: JoiValidationConstants.STRING.valid(
      ...OBJECTIONS_OPTIONS,
    ).required(),
    supportingDocuments: joi.array().optional(), // validated with SupportingDocumentInformationFactory
  };

  const makeRequired = itemName => {
    schema[itemName] = schemaOptionalItems[itemName];
  };

  if (rawProps.certificateOfService === true) {
    makeRequired('certificateOfServiceDate');
  }

  if (documentWithAttachments) {
    makeRequired('attachments');
  }

  if (documentWithObjections) {
    makeRequired('objections');
  }

  if (documentWithSupportingDocuments) {
    makeRequired('hasSupportingDocuments');
  }

  if (
    (!rawProps.filers || rawProps.filers.length === 0) &&
    rawProps.partyIrsPractitioner !== true
  ) {
    makeRequired('filers');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    CaseAssociationRequestFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new (validEntityDecorator(entityConstructor))(rawProps);
}

CaseAssociationRequestFactory.VALIDATION_ERROR_MESSAGES = {
  ...VALIDATION_ERROR_MESSAGES,
  documentTitleTemplate: 'Select a document',
  eventCode: 'Select a document',
  filers: 'Select a party',
  scenario: 'Select a document',
};

module.exports = { CaseAssociationRequestFactory };
