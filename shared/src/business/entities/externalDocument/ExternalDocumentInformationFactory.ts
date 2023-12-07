import {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  AMENDMENT_EVENT_CODES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
} from '../EntityConstants';
import { ExternalDocumentBase } from '@shared/business/entities/externalDocument/ExternalDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { SecondaryDocumentInformationFactory } from './SecondaryDocumentInformationFactory';
import { SupportingDocumentInformationFactory } from './SupportingDocumentInformationFactory';
import {
  addPropertyHelper,
  makeRequiredHelper,
} from './externalDocumentHelpers';
import { isEqual, reduce, some, sortBy, values } from 'lodash';
import joi from 'joi';

export class ExternalDocumentInformationFactory extends JoiValidationEntity {
  public attachments: string;
  public casesParties?: object;
  public certificateOfService: boolean;
  public certificateOfServiceDate: string;
  public documentType: string;
  public eventCode?: string;
  public freeText?: string;
  public hasSecondarySupportingDocuments: boolean;
  public hasSupportingDocuments: boolean;
  public lodged?: boolean;
  public filers: string[];
  public objections: string;
  public ordinalValue?: string;
  public partyIrsPractitioner: boolean;
  public previousDocument?: ExternalDocumentBase;
  public primaryDocumentFile: object;
  public secondaryDocument: object;
  public secondaryDocumentFile: object;
  public secondarySupportingDocuments?: object[];
  public selectedCases?: string[];
  public supportingDocuments?: object[];

  private scenario: string;
  private freeText2: string;

  constructor(rawProps) {
    super('ExternalDocumentInformationFactory');
    this.attachments = rawProps.attachments || false;
    this.casesParties = rawProps.casesParties;
    this.certificateOfService = rawProps.certificateOfService;
    this.certificateOfServiceDate = rawProps.certificateOfServiceDate;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.freeText = rawProps.freeText;
    this.hasSecondarySupportingDocuments =
      rawProps.hasSecondarySupportingDocuments;
    this.hasSupportingDocuments = rawProps.hasSupportingDocuments;
    this.lodged = rawProps.lodged;
    this.filers = rawProps.filers;
    this.objections = rawProps.objections;
    this.ordinalValue = rawProps.ordinalValue;
    this.partyIrsPractitioner = rawProps.partyIrsPractitioner;
    this.previousDocument = rawProps.previousDocument;
    this.primaryDocumentFile = rawProps.primaryDocumentFile;
    this.secondaryDocument = rawProps.secondaryDocument;
    this.secondaryDocumentFile = rawProps.secondaryDocumentFile;
    this.secondarySupportingDocuments = rawProps.secondarySupportingDocuments;
    this.selectedCases = rawProps.selectedCases;
    this.supportingDocuments = rawProps.supportingDocuments;

    this.scenario = rawProps.scenario;
    this.freeText2 = rawProps.freeText2;

    if (this.secondaryDocument) {
      this.secondaryDocument = new SecondaryDocumentInformationFactory({
        ...this.secondaryDocument,
        secondaryDocumentFile: this.secondaryDocumentFile,
      });
    }

    if (this.supportingDocuments) {
      this.supportingDocuments = this.supportingDocuments.map(item => {
        return new SupportingDocumentInformationFactory(item);
      });
    }

    if (this.secondarySupportingDocuments) {
      this.secondarySupportingDocuments = this.secondarySupportingDocuments.map(
        item => {
          return new SupportingDocumentInformationFactory(item);
        },
      );
    }
  }

  getValidationRules() {
    let schema = {
      attachments: joi
        .boolean()
        .required()
        .messages({ '*': 'Enter selection for Attachments.' }),
      casesParties: joi.object().optional(),
      certificateOfService: joi.boolean().required().messages({
        '*': 'Indicate whether you are including a Certificate of Service',
      }),
      documentType: JoiValidationConstants.STRING.valid(...ALL_DOCUMENT_TYPES)
        .messages({ '*': 'Select a document type' })
        .required(),
      eventCode: JoiValidationConstants.STRING.valid(
        ...ALL_EVENT_CODES,
      ).optional(),
      freeText: JoiValidationConstants.STRING.optional().messages({
        'any.required': 'Provide an answer',
        'string.max':
          'Limit is 1000 characters. Enter 1000 or fewer characters.',
      }),
      hasSupportingDocuments: joi
        .boolean()
        .required()
        .messages({ '*': 'Enter selection for Supporting Documents.' }),
      lodged: joi.boolean().optional(),
      ordinalValue: JoiValidationConstants.STRING.optional().messages({
        '*': 'Select an iteration',
      }),
      previousDocument: joi
        .object()
        .optional()
        .messages({ '*': 'Select a document' }),
      primaryDocumentFile: joi
        .object()
        .required()
        .messages({ '*': 'Upload a document' }),
    };

    let schemaOptionalItems = {
      certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max(
        'now',
      ).messages({
        '*': 'Enter date of service',
        'date.max':
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      }),
      filers: joi
        .array()
        .items(JoiValidationConstants.UUID.required())
        .required()
        .messages({ '*': 'Select a filing party' }),
      hasSecondarySupportingDocuments: joi.boolean().messages({
        '*': 'Enter selection for Secondary Supporting Documents.',
      }),

      objections: JoiValidationConstants.STRING.messages({
        '*': 'Enter selection for Objections.',
      }),
      partyIrsPractitioner: joi
        .boolean()
        .messages({ '*': 'Select a filing party' }),
      secondaryDocumentFile: joi
        .object()
        .messages({ '*': 'Upload a document' }),
      secondarySupportingDocuments: joi.array().optional(),
      selectedCases: joi
        .array()
        .items(JoiValidationConstants.STRING)
        .optional(),
      supportingDocuments: joi.array().optional(),
    };

    const addProperty = (itemName, itemSchema, itemErrorMessage?) => {
      const options = {
        errorToMessageMap: {},
        itemErrorMessage,
        itemName,
        itemSchema,
        schema,
      };
      addPropertyHelper(options);
    };

    const makeRequired = itemName => {
      makeRequiredHelper({
        itemName,
        schema,
        schemaOptionalItems,
      });
    };

    if (this.certificateOfService === true) {
      makeRequired('certificateOfServiceDate');
    }

    const objectionDocumentTypes = [
      ...DOCUMENT_EXTERNAL_CATEGORIES_MAP['Motion'].map(entry => {
        return entry.documentType;
      }),
      'Motion to Withdraw Counsel (filed by petitioner)',
      'Motion to Withdraw as Counsel',
      'Application to Take Deposition',
    ];

    if (
      objectionDocumentTypes.includes(this.documentType) ||
      (AMENDMENT_EVENT_CODES.includes(this.eventCode!) &&
        objectionDocumentTypes.includes(this.previousDocument?.documentType!))
    ) {
      makeRequired('objections');
    }

    if (
      this.scenario &&
      this.scenario.toLowerCase().trim() === 'nonstandard h'
    ) {
      if (this.documentType === 'Motion for Leave to File Out of Time') {
        makeRequired('secondaryDocumentFile');
      }

      if (this.secondaryDocumentFile) {
        makeRequired('hasSecondarySupportingDocuments');
      }
    }

    if (this.selectedCases && this.selectedCases.length > 1) {
      if (this.partyIrsPractitioner !== true) {
        const casesWithAPartySelected = reduce(
          this.casesParties,
          (accArray: string[], parties: object, docketNumber: string) => {
            if (some(values(parties))) {
              accArray.push(docketNumber);
            }
            return accArray;
          },
          [],
        );
        if (
          !isEqual(sortBy(this.selectedCases), sortBy(casesWithAPartySelected))
        ) {
          addProperty(
            'filers',
            joi
              .array()
              .items(joi.string().required())
              .messages({ '*': 'Select a filing party' }),
          );
        }
      }
    } else {
      if (this.filers.length === 0 && this.partyIrsPractitioner !== true) {
        addProperty(
          'filers',
          joi
            .array()
            .items(joi.string().required())
            .messages({ '*': 'Select a filing party' }),
        );
      }
    }

    return schema;
  }
}
