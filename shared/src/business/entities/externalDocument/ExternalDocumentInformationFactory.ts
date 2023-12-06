import {
  ALL_DOCUMENT_TYPES,
  ALL_EVENT_CODES,
  AMENDMENT_EVENT_CODES,
  DOCUMENT_EXTERNAL_CATEGORIES_MAP,
  MAX_FILE_SIZE_MB,
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
      this.secondaryDocument = new SecondaryDocumentInformationFactory(
        {
          ...this.secondaryDocument,
          secondaryDocumentFile: this.secondaryDocumentFile,
        },
        ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
      );
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

  static VALIDATION_ERROR_MESSAGES = {
    additionalInfo: [
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 500 characters. Enter 500 or fewer characters.',
      },
    ],
    additionalInfo2: [
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 500 characters. Enter 500 or fewer characters.',
      },
    ],
    attachments: 'Enter selection for Attachments.',
    category: 'Select a Category.',
    certificateOfService:
      'Indicate whether you are including a Certificate of Service',
    certificateOfServiceDate: [
      {
        contains: 'must be less than or equal to',
        message:
          'Certificate of Service date cannot be in the future. Enter a valid date.',
      },
      'Enter date of service',
    ],
    documentTitle:
      'Document title must be 3000 characters or fewer. Update this document title and try again.',
    documentType: [
      {
        contains: 'contains an invalid value',
        message:
          'Proposed Stipulated Decision must be filed separately in each case',
      },
      'Select a document type',
    ],
    filers: 'Select a filing party',
    freeText: [
      { contains: 'is required', message: 'Provide an answer' },
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
      },
    ],
    freeText2: [
      { contains: 'is required', message: 'Provide an answer' },
      {
        contains: 'must be less than or equal to',
        message: 'Limit is 1000 characters. Enter 1000 or fewer characters.',
      },
    ],
    hasSecondarySupportingDocuments:
      'Enter selection for Secondary Supporting Documents.',
    hasSupportingDocuments: 'Enter selection for Supporting Documents.',
    objections: 'Enter selection for Objections.',
    ordinalValue: 'Select an iteration',
    otherIteration: [
      {
        contains: 'is required',
        message: 'Enter an iteration number.',
      },
      'Maximum iteration value is 999.',
    ],
    partyIrsPractitioner: 'Select a filing party',
    previousDocument: 'Select a document',
    primaryDocumentFile: 'Upload a document',
    primaryDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Primary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Primary Document file size is empty.',
    ],
    secondaryDocument: 'Select a document',
    secondaryDocumentFile: 'Upload a document',
    secondaryDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Secondary Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Secondary Document file size is empty.',
    ],
    serviceDate: [
      {
        contains: 'must be less than or equal to',
        message: 'Service date cannot be in the future. Enter a valid date.',
      },
      'Provide a service date',
    ],
    supportingDocument: 'Select a document type',
    supportingDocumentFile: 'Upload a document',
    supportingDocumentFileSize: [
      {
        contains: 'must be less than or equal to',
        message: `Your Supporting Document file size is too big. The maximum file size is ${MAX_FILE_SIZE_MB}MB.`,
      },
      'Your Supporting Document file size is empty.',
    ],
    supportingDocumentFreeText: 'Enter name',
    trialLocation: 'Select a preferred trial location.',
  } as const;

  getValidationRules() {
    let schema = {
      attachments: joi.boolean().required(),
      casesParties: joi.object().optional(),
      certificateOfService: joi.boolean().required(),
      documentType: JoiValidationConstants.STRING.valid(
        ...ALL_DOCUMENT_TYPES,
      ).optional(),
      eventCode: JoiValidationConstants.STRING.valid(
        ...ALL_EVENT_CODES,
      ).optional(),
      freeText: JoiValidationConstants.STRING.optional(),
      hasSupportingDocuments: joi.boolean().required(),
      lodged: joi.boolean().optional(),
      ordinalValue: JoiValidationConstants.STRING.optional(),
      previousDocument: joi.object().optional(),
      primaryDocumentFile: joi.object().required(),
    };

    let schemaOptionalItems = {
      certificateOfServiceDate: JoiValidationConstants.ISO_DATE.max('now'),
      filers: joi
        .array()
        .items(JoiValidationConstants.UUID.required())
        .required(),
      hasSecondarySupportingDocuments: joi.boolean(),
      objections: JoiValidationConstants.STRING,
      partyIrsPractitioner: joi.boolean(),
      secondaryDocumentFile: joi.object(),
      secondarySupportingDocuments: joi.array().optional(),
      selectedCases: joi
        .array()
        .items(JoiValidationConstants.STRING)
        .optional(),
      supportingDocuments: joi.array().optional(),
    };

    const addProperty = (itemName, itemSchema, itemErrorMessage?) => {
      addPropertyHelper({
        VALIDATION_ERROR_MESSAGES:
          ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES,
        itemErrorMessage,
        itemName,
        itemSchema,
        schema,
      });
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
            joi.array().items(joi.string().required()).required(),
          );
        }
      }
    } else {
      if (this.filers.length === 0 && this.partyIrsPractitioner !== true) {
        addProperty(
          'filers',
          joi.array().items(joi.string().required()).required(),
        );
      }
    }

    return schema;
  }

  getErrorToMessageMap() {
    return ExternalDocumentInformationFactory.VALIDATION_ERROR_MESSAGES;
  }
}
