import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import { Case } from './cases/Case';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';
import joi from 'joi';
export class CaseDeadline extends JoiValidationEntity {
  public associatedJudge: string;
  public associatedJudgeId: string;
  public caseDeadlineId: string;
  public createdAt: string;
  public deadlineDate: string;
  public description: string;
  public docketNumber: string;
  public leadDocketNumber?: string;
  public sortableDocketNumber: number;

  constructor(rawProps, { applicationContext }) {
    super('CaseDeadline');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.associatedJudge = rawProps.associatedJudge;
    this.associatedJudgeId = rawProps.associatedJudgeId;
    this.caseDeadlineId =
      rawProps.caseDeadlineId || applicationContext.getUniqueId();
    this.createdAt = rawProps.createdAt || createISODateString();
    this.deadlineDate = rawProps.deadlineDate;
    this.description = rawProps.description;
    this.docketNumber = rawProps.docketNumber;
    this.leadDocketNumber = rawProps.leadDocketNumber;
    this.sortableDocketNumber =
      rawProps.sortableDocketNumber ||
      Case.getSortableDocketNumber(this.docketNumber);
  }

  static VALIDATION_RULES = {
    associatedJudge: JoiValidationConstants.STRING.max(50)
      .required()
      .description('Judge assigned to the case containing this Case Deadline.')
      .messages({ '*': 'Associated judge is required' }),
    associatedJudgeId: joi
      .when('associatedJudge', {
        is: CHIEF_JUDGE,
        otherwise: JoiValidationConstants.UUID.required(),
        then: JoiValidationConstants.UUID.optional(),
      })
      .description('Judge ID assigned to this case.'),
    caseDeadlineId: JoiValidationConstants.UUID.required().description(
      'Unique Case Deadline ID only used by the system.',
    ),
    createdAt: JoiValidationConstants.ISO_DATE.required().description(
      'When the Case Deadline was added to the system.',
    ),
    deadlineDate: JoiValidationConstants.ISO_DATE.required()
      .description('When the Case Deadline expires.')
      .messages({ '*': 'Enter a valid deadline date' }),
    description: JoiValidationConstants.STRING.max(120)
      .min(1)
      .required()
      .description('User provided description of the Case Deadline.')
      .messages({
        '*': 'Enter a description of this deadline',
        'string.max':
          'The description is too long. Please enter a valid description.',
      }),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required()
      .description('Docket number of the case containing the Case Deadline.')
      .messages({ '*': 'You must have a docket number.' }),
    entityName: JoiValidationConstants.STRING.valid('CaseDeadline').required(),
    leadDocketNumber: JoiValidationConstants.DOCKET_NUMBER.optional(),
    sortableDocketNumber: joi
      .number()
      .required()
      .description(
        'A sortable representation of the docket number of the case containing the Case Deadline.',
      )
      .messages({ '*': 'Sortable docket number is required' }),
  };

  getValidationRules() {
    return CaseDeadline.VALIDATION_RULES;
  }
}

export type RawCaseDeadline = ExcludeMethods<CaseDeadline>;
