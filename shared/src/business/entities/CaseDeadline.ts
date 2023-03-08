import { Case } from './cases/Case';
import {
  IValidationEntity,
  TStaticValidationMethods,
  joiValidationDecorator,
  validEntityDecorator,
} from './JoiValidationDecorator';
import { JoiValidationConstants } from './JoiValidationConstants';
import { createISODateString } from '../utilities/DateHandler';
import joi from 'joi';

export class CaseDeadlineClass {
  public associatedJudge: string;
  public caseDeadlineId: string;
  public createdAt: string;
  public deadlineDate: string;
  public description: string;
  public docketNumber: string;
  public sortableDocketNumber: string;
  public entityName: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(rawProps, { applicationContext }) {
    this.entityName = 'CaseDeadline';
  }

  init(rawProps, { applicationContext }) {
    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.associatedJudge = rawProps.associatedJudge;
    this.caseDeadlineId =
      rawProps.caseDeadlineId || applicationContext.getUniqueId();
    this.createdAt = rawProps.createdAt || createISODateString();
    this.deadlineDate = rawProps.deadlineDate;
    this.description = rawProps.description;
    this.docketNumber = rawProps.docketNumber;
    // TODO: why is this if statement here
    if (this.docketNumber) {
      this.sortableDocketNumber = Case.getSortableDocketNumber(
        this.docketNumber,
      );
    }
  }

  static VALIDATION_ERROR_MESSAGES = {
    associatedJudge: 'Associated judge is required',
    deadlineDate: 'Enter a valid deadline date',
    description: [
      {
        contains: 'length must be less than or equal to',
        message:
          'The description is too long. Please enter a valid description.',
      },
      'Enter a description of this deadline',
    ],
    docketNumber: 'You must have a docket number.',
    sortableDocketNumber: 'Sortable docket number is required',
  };
}

const schema = joi.object().keys({
  associatedJudge: JoiValidationConstants.STRING.max(50)
    .required()
    .description('Judge assigned to the case containing this Case Deadline.'),
  caseDeadlineId: JoiValidationConstants.UUID.required().description(
    'Unique Case Deadline ID only used by the system.',
  ),
  createdAt: JoiValidationConstants.ISO_DATE.required().description(
    'When the Case Deadline was added to the system.',
  ),
  deadlineDate: JoiValidationConstants.ISO_DATE.required().description(
    'When the Case Deadline expires.',
  ),
  description: JoiValidationConstants.STRING.max(120)
    .min(1)
    .required()
    .description('User provided description of the Case Deadline.'),
  docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
    'Docket number of the case containing the Case Deadline.',
  ),
  entityName: JoiValidationConstants.STRING.valid('CaseDeadline').required(),
  sortableDocketNumber: joi
    .number()
    .required()
    .description(
      'A sortable representation of the docket number of the case containing the Case Deadline.',
    ),
});

joiValidationDecorator(
  CaseDeadlineClass,
  schema,
  CaseDeadlineClass.VALIDATION_ERROR_MESSAGES,
);

export const CaseDeadline: typeof CaseDeadlineClass &
  TStaticValidationMethods<RawCaseDeadline> =
  validEntityDecorator(CaseDeadlineClass);

declare global {
  type RawCaseDeadline = ExcludeMethods<CaseDeadlineClass>;
}
// eslint-disable-next-line no-redeclare
export interface CaseDeadlineClass
  extends IValidationEntity<CaseDeadlineClass> {}
