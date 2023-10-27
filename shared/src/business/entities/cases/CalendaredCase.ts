import { DOCKET_NUMBER_SUFFIXES } from '../EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';
import { IrsPractitioner } from '../IrsPractitioner';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { PrivatePractitioner } from '../PrivatePractitioner';
import joi from 'joi';

export class CalendaredCase extends JoiValidationEntity {
  public docketEntries?: DocketEntry[];
  public caseCaption?: string;
  public docketNumber: string;
  public docketNumberSuffix?: string;
  public docketNumberWithSuffix?: string;
  public leadDocketNumber?: string;
  public irsPractitioners?: IrsPractitioner[];
  public privatePractitioners?: PrivatePractitioner[];

  constructor(rawProps, applicationContext: IApplicationContext) {
    super('CalendaredCase');

    this.caseCaption = rawProps.caseCaption;
    this.docketEntries = rawProps.docketEntries;
    this.docketNumber = rawProps.docketNumber;
    this.leadDocketNumber = rawProps.leadDocketNumber;
    this.docketNumberSuffix = rawProps.docketNumberSuffix;
    this.docketNumberWithSuffix =
      rawProps.docketNumber + (rawProps.docketNumberSuffix || '');

    if (Array.isArray(rawProps.docketEntries)) {
      this.docketEntries = rawProps.docketEntries.map(
        docketEntry => new DocketEntry(docketEntry, { applicationContext }),
      );
    } else {
      this.docketEntries = [];
    }

    if (Array.isArray(rawProps.privatePractitioners)) {
      this.privatePractitioners = rawProps.privatePractitioners.map(
        practitioner => new PrivatePractitioner(practitioner),
      );
    } else {
      this.privatePractitioners = [];
    }

    if (Array.isArray(rawProps.irsPractitioners)) {
      this.irsPractitioners = rawProps.irsPractitioners.map(
        practitioner => new IrsPractitioner(practitioner),
      );
    } else {
      this.irsPractitioners = [];
    }
  }

  static VALIDATION_RULES = {
    caseCaption: JoiValidationConstants.CASE_CAPTION.optional(),
    docketEntries: joi.array().optional(),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
      'Unique case identifier in XXXXX-YY format.',
    ),
    docketNumberSuffix: JoiValidationConstants.STRING.allow(null)
      .valid(...Object.values(DOCKET_NUMBER_SUFFIXES))
      .optional(),
    docketNumberWithSuffix:
      JoiValidationConstants.STRING.optional().description(
        'Auto-generated from docket number and the suffix.',
      ),
    irsPractitioners: joi
      .array()
      .items(IrsPractitioner.VALIDATION_RULES)
      .optional()
      .description(
        'List of IRS practitioners (also known as respondents) associated with the case.',
      ),
    privatePractitioners: joi
      .array()
      .items(PrivatePractitioner.VALIDATION_RULES)
      .optional()
      .description('List of private practitioners associated with the case.'),
  };

  static VALIDATION_ERROR_MESSAGES = {};

  getValidationRules() {
    return CalendaredCase.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return CalendaredCase.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawCalendaredCase = ExcludeMethods<CalendaredCase>;
