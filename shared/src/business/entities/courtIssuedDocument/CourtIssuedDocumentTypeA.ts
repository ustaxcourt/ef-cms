import {
  CourtIssuedDocument,
  DOCUMENT_TYPES_REQUIRING_DESCRIPTION,
  GENERIC_ORDER_DOCUMENT_TYPE,
  SERVICE_STAMP_OPTIONS,
  VALIDATION_ERROR_MESSAGES,
} from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
import { setDefaultErrorMessages } from '@shared/business/entities/utilities/setDefaultErrorMessages';
import joi from 'joi';

export class CourtIssuedDocumentTypeA extends CourtIssuedDocument {
  public attachments: boolean;
  public documentTitle?: string;
  public documentType: string;
  public eventCode?: string;
  public filingDate?: string;
  public freeText?: string;
  public isLegacy: boolean;
  public serviceStamp?: string;

  constructor(rawProps) {
    super('CourtIssuedDocumentTypeA');

    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.freeText = rawProps.freeText;
    this.isLegacy = rawProps.isLegacy;
    this.serviceStamp = rawProps.serviceStamp;
  }
  static VALIDATION_RULES = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES,
    freeText: JoiValidationConstants.STRING.max(1000).when('documentType', {
      is: joi.exist().valid(...DOCUMENT_TYPES_REQUIRING_DESCRIPTION),
      otherwise: joi.optional().allow(null),
      then: joi.required(),
    }),
    serviceStamp: JoiValidationConstants.STRING.valid(
      ...SERVICE_STAMP_OPTIONS,
    ).when('documentType', {
      is: GENERIC_ORDER_DOCUMENT_TYPE,
      otherwise: joi.optional().allow(null),
      then: joi.when('isLegacy', {
        is: true,
        otherwise: joi.required(),
        then: joi.optional().allow(null),
      }),
    }),
  };

  static VALIDATION_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;

  getDocumentTitle() {
    return replaceBracketed(this.documentTitle, this.freeText);
  }

  getValidationRules() {
    return CourtIssuedDocumentTypeA.VALIDATION_RULES;
  }

  static VALIDATION_RULES_NEW = {
    ...CourtIssuedDocumentBase.VALIDATION_RULES_NEW,
    freeText: JoiValidationConstants.STRING.max(1000)
      .when('documentType', {
        is: joi.exist().valid(...DOCUMENT_TYPES_REQUIRING_DESCRIPTION),
        otherwise: joi.optional().allow(null),
        then: joi.required(),
      })
      .messages({
        'any.required': 'Enter a description',
        'string.max':
          'Limit is 1000 characters. Enter 1000 or fewer characters.',
      }),
    serviceStamp: JoiValidationConstants.STRING.valid(...SERVICE_STAMP_OPTIONS)
      .when('documentType', {
        is: GENERIC_ORDER_DOCUMENT_TYPE,
        otherwise: joi.optional().allow(null),
        then: joi.when('isLegacy', {
          is: true,
          otherwise: joi.required(),
          then: joi.optional().allow(null),
        }),
      })
      .messages(setDefaultErrorMessages('Select a service stamp')),
  };

  getValidationRules_NEW() {
    return CourtIssuedDocumentTypeA.VALIDATION_RULES_NEW;
  }

  getErrorToMessageMap() {
    return CourtIssuedDocumentTypeA.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCourtIssuedDocumentTypeA =
  ExcludeMethods<CourtIssuedDocumentTypeA>;
