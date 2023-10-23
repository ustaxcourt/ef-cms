import { Case } from './cases/Case';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';
import { setDefaultErrorMessage } from '@shared/business/entities/utilities/setDefaultErrorMessage';

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

  getValidationRules_NEW() {
    return {
      caseCaption: Case.VALIDATION_RULES_NEW.caseCaption.messages(
        setDefaultErrorMessage('Enter a case caption'),
      ),
      closedDate: Case.VALIDATION_RULES_NEW.closedDate,
      createdAt: Case.VALIDATION_RULES_NEW.createdAt,
      docketNumber: Case.VALIDATION_RULES_NEW.docketNumber.messages(
        setDefaultErrorMessage('Docket number is required'),
      ),
      docketNumberWithSuffix: Case.VALIDATION_RULES_NEW.docketNumberWithSuffix,
      entityName: JoiValidationConstants.STRING.valid('UserCase').required(),
      leadDocketNumber: Case.VALIDATION_RULES_NEW.leadDocketNumber,
      status: Case.VALIDATION_RULES_NEW.status,
    };
  }

  getErrorToMessageMap() {
    return Case.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawUserCase = ExcludeMethods<UserCase>;
