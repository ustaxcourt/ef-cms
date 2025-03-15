import {
  FORMATS,
  createISODateAtStartOfDayEST,
  formatDateString,
} from '../utilities/DateHandler';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { ORDER_REPLY_OPTIONS } from '@shared/business/entities/EntityConstants';
import joiDate from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(joiDate);

export class MotionOrderResponseForm extends JoiValidationEntity {
  public motionOrderResponse?: string;
  public responseDate?: string;
  public additionalText?: string;
  public dueDate?: string;

  constructor(rawProps) {
    super('MotionOrderResponseForm');

    this.motionOrderResponse = rawProps.motionOrderResponse;
    this.responseDate = rawProps.responseDate;
    this.additionalText = rawProps.additionalText;
    this.dueDate = rawProps.dueDate;
  }

  static TODAY = formatDateString(
    createISODateAtStartOfDayEST(),
    FORMATS.YYYYMMDD,
  );

  static VALIDATION_RULES = {
    additionalText: JoiValidationConstants.STRING.max(256)
      .optional()
      .allow(null, ''),
    dueDate: joi
      .date()
      .iso()
      .format(['YYYY-MM-DD']) // expects format 'YYYY-MM-DD' != 'yyyy-MM-dd'
      .min(MotionOrderResponseForm.TODAY)
      .required()
      .description('When the response is due.'),
    motionOrderResponse: JoiValidationConstants.STRING.max(256)
      .required()
      .messages({
        '*': 'Enter a response',
      })
      .valid(Object.values(ORDER_REPLY_OPTIONS))
      .required()
      .description('The type of response.'),
    responseDate: joi
      .date()
      .iso()
      .format(['YYYY-MM-DD']) // expects format 'YYYY-MM-DD' != 'yyyy-MM-dd'
      .min(MotionOrderResponseForm.TODAY)
      .required()
      .description('When the response was filed.'),
  };

  getValidationRules() {
    return MotionOrderResponseForm.VALIDATION_RULES;
  }
}

export type RawMotionOrderResponserForm =
  ExcludeMethods<MotionOrderResponseForm>;
