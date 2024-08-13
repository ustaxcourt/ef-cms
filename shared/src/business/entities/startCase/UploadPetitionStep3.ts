import {
  CASE_TYPES,
  CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE,
} from '@shared/business/entities/EntityConstants';
import { CreateCaseIrsForm } from '@web-client/presenter/state';
import { IrsNoticeForm } from '@shared/business/entities/startCase/IrsNoticeForm';
import { JoiValidationConstants } from '@shared/business/entities/JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { cloneDeep } from 'lodash';
import joi from 'joi';

export class UploadPetitionStep3 extends JoiValidationEntity {
  public hasIrsNotice: boolean;
  public irsNotices?: CreateCaseIrsForm[];
  public caseType?: string;
  public irsNoticesRedactionAcknowledgement?: boolean;
  public hasUploadedIrsNotice: boolean;

  static VALID_CASE_TYPES = cloneDeep(CASE_TYPES)
    .map(caseType => {
      const caseDescription =
        CASE_TYPE_DESCRIPTIONS_WITHOUT_IRS_NOTICE[caseType];
      if (caseDescription) {
        return caseType;
      }
    })
    .filter(Boolean);

  constructor(rawProps) {
    super('UploadPetitionStep3');
    this.hasIrsNotice = rawProps.hasIrsNotice;
    this.irsNotices = rawProps.hasIrsNotice
      ? (rawProps.irsNotices || []).map(irsN => new IrsNoticeForm(irsN))
      : undefined;
    this.caseType = rawProps.caseType;
    this.irsNoticesRedactionAcknowledgement =
      rawProps.irsNoticesRedactionAcknowledgement;
    this.hasUploadedIrsNotice = rawProps.hasUploadedIrsNotice;
  }

  static VALIDATION_RULES = {
    caseType: joi
      .string()
      .required()
      .when('hasIrsNotice', {
        is: false,
        otherwise: joi.string().optional(),
        then: JoiValidationConstants.STRING.required().valid(
          ...this.VALID_CASE_TYPES,
        ),
      })
      .messages({
        '*': 'Select a case type',
        'any.only': 'Select a correct case type',
      }),
    hasIrsNotice: joi.boolean().required().valid(true, false).messages({
      '*': 'Indicate whether you received an IRS notice',
    }),
    hasUploadedIrsNotice: joi.boolean().required(),
    irsNotices: joi.when('hasIrsNotice', {
      is: true,
      otherwise: joi.array().optional(),
      then: joi
        .array()
        .min(1)
        .max(5)
        .required()
        .items(IrsNoticeForm.VALIDATION_RULES),
    }),
    irsNoticesRedactionAcknowledgement: joi.when('hasUploadedIrsNotice', {
      is: true,
      otherwise: joi.optional(),
      then: joi.boolean().required().valid(true),
    }),
  };

  getValidationRules() {
    return UploadPetitionStep3.VALIDATION_RULES;
  }
}

export type RawUploadPetitionStep3 = ExcludeMethods<
  Omit<UploadPetitionStep3, 'entityName'>
>;
