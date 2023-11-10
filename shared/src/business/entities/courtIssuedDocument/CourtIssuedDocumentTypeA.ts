import {
  CourtIssuedDocument,
  DOCUMENT_TYPES_REQUIRING_DESCRIPTION,
  GENERIC_ORDER_DOCUMENT_TYPE,
  SERVICE_STAMP_OPTIONS,
} from './CourtIssuedDocumentConstants';
import { CourtIssuedDocumentBase } from './CourtIssuedDocumentBase';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { replaceBracketed } from '../../utilities/replaceBracketed';
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
      .messages({ '*': 'Select a service stamp' }),
  };

  getValidationRules() {
    return CourtIssuedDocumentTypeA.VALIDATION_RULES;
  }

  getDocumentTitle() {
    return replaceBracketed(this.documentTitle, this.freeText);
  }
}

export type RawCourtIssuedDocumentTypeA =
  ExcludeMethods<CourtIssuedDocumentTypeA>;
