import { CreateCaseIrsForm } from '@web-client/presenter/state';
import { IrsNoticeForm } from '@shared/business/entities/startCase/IrsNoticeForm';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { omit } from 'lodash';
import joi from 'joi';

export class UploadPetitionStep3 extends JoiValidationEntity {
  public hasIrsNotice: boolean;
  public irsNotices: CreateCaseIrsForm[];

  constructor(rawProps) {
    super('UploadPetitionStep3');
    this.hasIrsNotice = rawProps.hasIrsNotice;
    this.irsNotices = rawProps.hasIrsNotice
      ? rawProps.irsNotices.map(irsN => new IrsNoticeForm(irsN))
      : undefined;
  }

  static VALIDATION_RULES = {
    hasIrsNotice: joi.boolean().required().valid(true, false),
    irsNotices: joi.when('hasIrsNotice', {
      is: true,
      otherwise: joi.array().optional(),
      then: joi.array().required().items(IrsNoticeForm.VALIDATION_RULES),
    }),
  };

  getValidationRules() {
    return UploadPetitionStep3.VALIDATION_RULES;
  }

  getFormattedValidationErrors(): Record<string, any> | null {
    const errors = super.getFormattedValidationErrors();

    //TODO: dynamically get the properies from IrsNoticeForm entity
    const filteredErrors = omit(errors, [
      'key',
      'file',
      'size',
      'caseType',
      'lastDateOfPeriod',
      'taxYear',
    ]);

    return Object.keys(filteredErrors).length === 0 ? null : filteredErrors;
  }
}

export type RawUploadPetitionStep1 = ExcludeMethods<
  Omit<UploadPetitionStep3, 'entityName'>
>;
