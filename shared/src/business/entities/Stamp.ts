import {
  FORMATS,
  createISODateAtStartOfDayEST,
  formatDateString,
} from '../utilities/DateHandler';
import {
  JURISDICTIONAL_OPTIONS,
  MOTION_DISPOSITIONS,
  STRICKEN_FROM_TRIAL_SESSION_MESSAGE,
} from './EntityConstants';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(joiDate);

export class Stamp extends JoiValidationEntity {
  public customText?: string;
  public date?: string;
  public deniedAsMoot?: string;
  public deniedWithoutPrejudice?: string;
  public disposition: string;
  public dueDateMessage?: string;
  public jurisdictionalOption?: string;
  public strickenFromTrialSession?: string;

  constructor(rawStamp) {
    super('Stamp');
    this.date = rawStamp.date;
    this.disposition = rawStamp.disposition;
    this.deniedAsMoot = rawStamp.deniedAsMoot;
    this.deniedWithoutPrejudice = rawStamp.deniedWithoutPrejudice;
    this.strickenFromTrialSession = rawStamp.strickenFromTrialSession;
    this.jurisdictionalOption = rawStamp.jurisdictionalOption;
    this.dueDateMessage = rawStamp.dueDateMessage;
    this.customText = rawStamp.customText;
  }

  static TODAY = formatDateString(
    createISODateAtStartOfDayEST(),
    FORMATS.MMDDYY,
  );

  static VALIDATION_RULES = {
    customText: JoiValidationConstants.STRING.max(60).optional().allow(''),
    date: joi
      .when('dueDateMessage', {
        is: joi.exist().not(null),
        otherwise: joi.optional().allow(null),
        then: joi
          .date()
          .iso()
          .format(['MM/DD/YY'])
          .min(Stamp.TODAY)
          .required()
          .description(
            'The due date of the status report (or proposed stipulated decision) filing',
          ),
      })
      .messages({
        '*': 'Enter a valid date',
        'date.min': 'Due date cannot be prior to today. Enter a valid date.',
      }),
    deniedAsMoot: joi.boolean().optional().allow(null),
    deniedWithoutPrejudice: joi.boolean().optional().allow(null),
    disposition: JoiValidationConstants.STRING.valid(
      ...Object.values(MOTION_DISPOSITIONS),
    )
      .required()
      .messages({ '*': 'Enter a disposition' }),
    dueDateMessage: joi.optional().allow(null),
    jurisdictionalOption: JoiValidationConstants.STRING.valid(
      ...Object.values(JURISDICTIONAL_OPTIONS),
    ),
    strickenFromTrialSession: JoiValidationConstants.STRING.valid(
      STRICKEN_FROM_TRIAL_SESSION_MESSAGE,
    )
      .optional()
      .allow(null),
  };

  getValidationRules() {
    return Stamp.VALIDATION_RULES;
  }
}

export type RawStamp = ExcludeMethods<Stamp>;
