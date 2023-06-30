export class ConsolidatedCaseDTO {
  public caseCaption: string;
  public docketNumber: string;
  public isSealed: boolean;
  public docketNumberWithSuffix: string;
  public entityName: string;
  public irsPractitioners: object[];
  public leadDocketNumber: string;
  public petitioners: object[];
  public privatePractitioners: object[];

  constructor(rawCase: any) {
    this.caseCaption = rawCase.caseCaption;
    this.docketNumber = rawCase.docketNumber;
    this.docketNumberWithSuffix = rawCase.docketNumberWithSuffix;
    this.entityName = rawCase.entityName;
    this.irsPractitioners = rawCase.irsPractitioners;
    this.leadDocketNumber = rawCase.leadDocketNumber;
    this.isSealed = rawCase.isSealed;
    this.petitioners = rawCase.petitioners;
    this.privatePractitioners = rawCase.privatePractitioners;
  }

  public static getFields() {
    return Object.getOwnPropertyNames.call(Object, new ConsolidatedCaseDTO({}));
  }
}
