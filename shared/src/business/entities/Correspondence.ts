import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';
import joi from 'joi';

export class Correspondence extends JoiValidationEntity {
  public archived: boolean;
  public correspondenceId: string;
  public documentTitle: string;
  public filedBy: string;
  public userId: string;
  public filingDate: string;

  constructor(rawProps) {
    super('Correspondence');
    this.archived = rawProps.archived;
    this.correspondenceId = rawProps.correspondenceId;
    this.documentTitle = rawProps.documentTitle;
    this.filedBy = rawProps.filedBy;
    this.userId = rawProps.userId;
    this.filingDate = rawProps.filingDate || createISODateString();
  }

  static VALIDATION_RULES = {
    archived: joi
      .boolean()
      .optional()
      .description('A correspondence document that was archived.'),
    correspondenceId: JoiValidationConstants.UUID.required(),
    documentTitle: JoiValidationConstants.STRING.max(500).required(),
    filedBy: JoiValidationConstants.STRING.max(500).allow('').optional(),
    filingDate: JoiValidationConstants.ISO_DATE.max('now')
      .required()
      .description('Date that this Document was filed.'),
    userId: JoiValidationConstants.UUID.required(),
  };

  getValidationRules() {
    return Correspondence.VALIDATION_RULES;
  }
}

declare global {
  type RawCorrespondence = ExcludeMethods<Correspondence>;
}
