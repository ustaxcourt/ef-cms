import { RestrictedCase } from '@shared/business/entities/cases/RestrictedCase';
import { removeServedParties } from '../helpers/removeServedParties';

export class RestrictedCaseDTO {
  public entityName = 'RestrictedCaseDTO';
  public docketNumber?: string;
  public docketNumberSuffix?: string;
  public isPaper?: boolean;
  public isSealed?: string;
  public leadDocketNumber?: boolean;
  public docketEntries: RawDocketEntry[];

  constructor(rawRestrictedCase: RawRestrictedCase) {
    rawRestrictedCase = new RestrictedCase(rawRestrictedCase).toRawObject();
    this.docketNumber = rawRestrictedCase.docketNumber;
    this.docketNumberSuffix = rawRestrictedCase.docketNumberSuffix;
    this.isPaper = rawRestrictedCase.isPaper;
    this.isSealed = rawRestrictedCase.isSealed;
    this.leadDocketNumber = rawRestrictedCase.leadDocketNumber;
    this.docketEntries = removeServedParties(rawRestrictedCase.docketEntries);
  }
}
