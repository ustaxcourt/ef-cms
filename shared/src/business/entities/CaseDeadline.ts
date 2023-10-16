import { Case } from './cases/Case';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';
import joi from 'joi';

export class CaseDeadline extends JoiValidationEntity {
  public associatedJudge: string;
  public caseDeadlineId: string;
  public createdAt: string;
  public deadlineDate: string;
  public description: string;
  public docketNumber: string;
  public sortableDocketNumber: number;
  public leadDocketNumber?: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(rawProps, { applicationContext }) {
    super('CaseDeadline');

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
    this.leadDocketNumber = rawProps.leadDocketNumber;
    this.sortableDocketNumber =
      rawProps.sortableDocketNumber ||
      Case.getSortableDocketNumber(this.docketNumber);
  }

  getValidationRules() {
    return {
      associatedJudge: JoiValidationConstants.STRING.max(50)
        .required()
        .description(
          'Judge assigned to the case containing this Case Deadline.',
        )
        .messages(setDefaultErrorMessage('Associated judge is required')),
      caseDeadlineId: JoiValidationConstants.UUID.required().description(
        'Unique Case Deadline ID only used by the system.',
      ),
      createdAt: JoiValidationConstants.ISO_DATE.required().description(
        'When the Case Deadline was added to the system.',
      ),
      deadlineDate: JoiValidationConstants.ISO_DATE.required()
        .description('When the Case Deadline expires.')
        .messages(setDefaultErrorMessage('Enter a valid deadline date')),
      description: JoiValidationConstants.STRING.max(120)
        .min(1)
        .required()
        .description('User provided description of the Case Deadline.')
        .messages({
          ...setDefaultErrorMessage('Enter a description of this deadline'),
          'string.max':
            'The description is too long. Please enter a valid description.',
        }),
      docketNumber: JoiValidationConstants.DOCKET_NUMBER.required()
        .description('Docket number of the case containing the Case Deadline.')
        .messages(setDefaultErrorMessage('You must have a docket number.')),
      entityName:
        JoiValidationConstants.STRING.valid('CaseDeadline').required(),
      leadDocketNumber: JoiValidationConstants.DOCKET_NUMBER.optional(),
      sortableDocketNumber: joi
        .number()
        .required()
        .description(
          'A sortable representation of the docket number of the case containing the Case Deadline.',
        )
        .messages(setDefaultErrorMessage('Sortable docket number is required')),
    };
  }
}

declare global {
  type RawCaseDeadline = ExcludeMethods<CaseDeadline>;
}
