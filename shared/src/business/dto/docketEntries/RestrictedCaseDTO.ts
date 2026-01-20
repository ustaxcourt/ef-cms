export class RestrictedCaseDTO {
  public docketNumber?: string;
  public docketNumberSuffix?: string;
  public isPaper?: boolean;
  public isSealed?: string;
  public leadDocketNumber?: boolean;
  public docketEntries: RawDocketEntry[];

  constructor(rawRestrictedCase: RawRestrictedCase) {
    this.docketNumber = rawRestrictedCase.docketNumber;
    this.docketNumberSuffix = rawRestrictedCase.docketNumberSuffix;
    this.isPaper = rawRestrictedCase.isPaper;
    this.isSealed = rawRestrictedCase.isSealed;
    this.leadDocketNumber = rawRestrictedCase.leadDocketNumber;
    this.docketEntries = rawRestrictedCase.docketEntries.map(de => {
      return {
        ...de,
        servedParties: undefined,
      };
    });
  }
}
