import { PaymentStatusTypes } from './EntityConstants';
import { createISODateString } from '../utilities/DateHandler';

export class UserCaseDTO {
  public caseCaption: string;
  public closedDate?: string;
  public createdAt: string;
  public docketNumber: string;
  public docketNumberWithSuffix: string;
  public isRequestingUserAssociated: boolean;
  public leadDocketNumber?: string;
  public petitionPaymentStatus: PaymentStatusTypes;
  public status: string;

  constructor(rawUserCase) {
    this.caseCaption = rawUserCase.caseCaption;
    this.createdAt = rawUserCase.createdAt || createISODateString();
    this.docketNumber = rawUserCase.docketNumber;
    this.docketNumberWithSuffix = rawUserCase.docketNumberWithSuffix;
    this.leadDocketNumber = rawUserCase.leadDocketNumber;
    this.status = rawUserCase.status;
    this.closedDate = rawUserCase.closedDate;
    this.petitionPaymentStatus = rawUserCase.petitionPaymentStatus;
    this.isRequestingUserAssociated = rawUserCase.isRequestingUserAssociated; // TODO: can this be removed?
  }
}
