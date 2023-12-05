import { CASE_TYPES, DOCKET_NUMBER_SUFFIXES } from '../EntityConstants';
import { IrsPractitioner } from '../IrsPractitioner';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { PrivatePractitioner } from '../PrivatePractitioner';
import joi from 'joi';

export class EligibleCase extends JoiValidationEntity {
  public caseCaption?: string;
  public caseType: string;
  public docketNumber: string;
  public docketNumberSuffix?: string;
  public docketNumberWithSuffix?: string;
  public highPriority?: boolean;
  public leadDocketNumber?: string;
  public irsPractitioners?: IrsPractitioner[];
  public privatePractitioners?: PrivatePractitioner[];
  public qcCompleteForTrial?: Record<string, any>;

  constructor(rawProps) {
    super('EligibleCase');

    this.caseCaption = rawProps.caseCaption;
    this.docketNumber = rawProps.docketNumber;
    this.leadDocketNumber = rawProps.leadDocketNumber;
    this.docketNumberSuffix = rawProps.docketNumberSuffix;
    this.docketNumberWithSuffix =
      rawProps.docketNumber + (rawProps.docketNumberSuffix || '');
    this.highPriority = rawProps.highPriority;
    this.caseType = rawProps.caseType;
    this.qcCompleteForTrial = rawProps.qcCompleteForTrial || {};

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
    caseType: JoiValidationConstants.STRING.valid(...CASE_TYPES).required(),
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
    highPriority: joi
      .boolean()
      .optional()
      .meta({ tags: ['Restricted'] }),
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
    qcCompleteForTrial: joi
      .object()
      .optional()
      .meta({ tags: ['Restricted'] })
      .description(
        'QC Checklist object that must be completed before the case can go to trial.',
      ),
  };

  getValidationRules() {
    return EligibleCase.VALIDATION_RULES;
  }
}

export type RawEligibleCase = ExcludeMethods<EligibleCase>;
