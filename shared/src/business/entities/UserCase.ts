import { Case } from './cases/Case';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';

export class UserCase extends JoiValidationEntity {
  public caseCaption: string;
  public createdAt: string;
  public docketNumber: string;
  public docketNumberWithSuffix: string;
  public leadDocketNumber?: string;
  public status: string;
  public closedDate?: string;

  constructor(rawUserCase) {
    super('UserCase');

    this.caseCaption = rawUserCase.caseCaption;
    this.createdAt = rawUserCase.createdAt || createISODateString();
    this.docketNumber = rawUserCase.docketNumber;
    this.docketNumberWithSuffix = rawUserCase.docketNumberWithSuffix;
    this.leadDocketNumber = rawUserCase.leadDocketNumber;
    this.status = rawUserCase.status;
    this.closedDate = rawUserCase.closedDate;
  }

  getValidationRules() {
    return {
      caseCaption: Case.VALIDATION_RULES.caseCaption,
      closedDate: Case.VALIDATION_RULES.closedDate,
      createdAt: Case.VALIDATION_RULES.createdAt,
      docketNumber: Case.VALIDATION_RULES.docketNumber,
      docketNumberWithSuffix: Case.VALIDATION_RULES.docketNumberWithSuffix,
      entityName: JoiValidationConstants.STRING.valid('UserCase').required(),
      leadDocketNumber: Case.VALIDATION_RULES.leadDocketNumber,
      status: Case.VALIDATION_RULES.status,
    };
  }

  getErrorToMessageMap() {
    return Case.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawUserCase = ExcludeMethods<UserCase>;
