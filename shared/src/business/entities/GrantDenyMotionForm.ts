import {
  FORMATS,
  createISODateAtStartOfDayEST,
  formatDateString,
} from '../utilities/DateHandler';
import {
  GRANT_DENY_MOTION_OPTIONS,
  MAX_GRANT_DENY_MOTION_ADDITIONAL_TEXT_CHARACTERS,
  MOTION_DISPOSITIONS,
} from './EntityConstants';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(joiDate);

export class GrantDenyMotionForm extends JoiValidationEntity {
  public additionalOrderText?: string[];
  public deniedAsMoot?: boolean;
  public deniedWithoutPrejudice?: boolean;
  public disposition?: string;
  public dueDate?: string;
  public dueDateMessage?: string;
  public filingParty?: string;
  public isOnLeadCase?: boolean;
  public issueOrder?: string;
  public jurisdiction?: string;
  public strickenFromTrialSession?: boolean;

  constructor(rawProps) {
    super('GrantDenyMotionForm');

    this.additionalOrderText = rawProps.additionalOrderText;
    this.deniedAsMoot = rawProps.deniedAsMoot;
    this.deniedWithoutPrejudice = rawProps.deniedWithoutPrejudice;
    this.disposition = rawProps.disposition;
    this.dueDate = rawProps.dueDate;
    this.dueDateMessage = rawProps.dueDateMessage;
    this.filingParty = rawProps.filingParty;
    this.isOnLeadCase = rawProps.isOnLeadCase;
    this.issueOrder = rawProps.issueOrder;
    this.jurisdiction = rawProps.jurisdiction;
    this.strickenFromTrialSession = rawProps.strickenFromTrialSession;
  }

  static TODAY = formatDateString(
    createISODateAtStartOfDayEST(),
    FORMATS.YYYYMMDD,
  );

  static VALIDATION_RULES = {
    additionalOrderText: joi
      .array()
      .items(
        JoiValidationConstants.STRING.max(
          MAX_GRANT_DENY_MOTION_ADDITIONAL_TEXT_CHARACTERS,
        )
          .allow('', null)
          .messages({
            'string.max': `Limit is ${MAX_GRANT_DENY_MOTION_ADDITIONAL_TEXT_CHARACTERS} characters per entry.`,
          }),
      )
      .optional()
      .allow(null),
    deniedAsMoot: joi.boolean().optional().allow(null),
    deniedWithoutPrejudice: joi.boolean().optional().allow(null),
    disposition: JoiValidationConstants.STRING.valid(
      MOTION_DISPOSITIONS.GRANTED,
      MOTION_DISPOSITIONS.DENIED,
    )
      .required()
      .messages({ '*': 'Select Granted or Denied' }),
    dueDate: joi
      .when('dueDateMessage', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi
          .date()
          .iso()
          .format(['YYYY-MM-DD'])
          .min(GrantDenyMotionForm.TODAY)
          .required()
          .description(
            'When the status report (or proposed stipulated decision) is due.',
          ),
      })
      .messages({
        'any.required':
          'Due date is required for status reports and stipulated decisions',
        'date.format': 'Enter a valid date',
        'date.min': 'Due date cannot be prior to today. Enter a valid date.',
      }),
    dueDateMessage: JoiValidationConstants.STRING.valid(
      GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions.statusReport,
      GRANT_DENY_MOTION_OPTIONS.dueDateMessageOptions
        .statusReportOrStipulatedDecision,
    )
      .optional()
      .allow(null),
    filingParty: JoiValidationConstants.STRING.valid(
      ...Object.values(GRANT_DENY_MOTION_OPTIONS.filingPartyOptions),
    )
      .when('dueDateMessage', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi.required().messages({
          'any.required':
            'Filing party is required when a status report or stipulated decision is ordered',
        }),
      })
      .optional()
      .allow(null),
    isOnLeadCase: joi.boolean().optional().allow(null),
    issueOrder: JoiValidationConstants.STRING.valid(
      GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.allCasesInGroup,
      GRANT_DENY_MOTION_OPTIONS.issueOrderOptions.justThisCase,
    )
      .when('isOnLeadCase', {
        is: true,
        otherwise: joi.optional().allow(null),
        then: joi.required().messages({
          'any.required': 'Select on which cases to file this order',
        }),
      })
      .optional()
      .allow(null),
    jurisdiction: JoiValidationConstants.STRING.valid(
      GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.retained,
      GRANT_DENY_MOTION_OPTIONS.jurisdictionOptions.restored,
    )
      .optional()
      .allow(null),
    strickenFromTrialSession: joi.boolean().optional().allow(null),
  };

  getValidationRules() {
    return GrantDenyMotionForm.VALIDATION_RULES;
  }
}

export type RawGrantDenyMotionForm = ExcludeMethods<GrantDenyMotionForm>;
