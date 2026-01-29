import { RawPublicContact } from '@shared/business/entities/cases/PublicContact';
import { IrsPractitioner } from '@shared/business/entities/IrsPractitioner';
import { PrivatePractitioner } from '@shared/business/entities/PrivatePractitioner';
import { ConsolidatedCaseSummary } from '../cases/ConsolidatedCaseSummary';
import { UnknownAuthUser } from '@shared/business/entities/authUser/AuthUser';
import { PublicCase } from '@shared/business/entities/cases/PublicCase';

export class PublicCaseDTO {
  public entityName = 'PublicCaseDTO';
  public canAllowDocumentService?: string;
  public canAllowPrintableDocketRecord?: string;
  public canDojPractitionersRepresentParty?: boolean;
  public caseCaption: string;
  public createdAt?: string;
  public leadDocketNumber?: string;
  public docketNumber: string;
  public docketNumberSuffix?: string;
  public docketNumberWithSuffix: string;
  public hasIrsPractitioner: boolean;
  public docketEntries: RawPublicDocketEntry[];
  public isPaper?: boolean;
  public partyType: string;
  public receivedAt: string;
  public isSealed: boolean;
  public petitioners?: RawPublicContact[];
  public irsPractitioners?: RawPublicContact[] | IrsPractitioner[];
  public privatePractitioners?: RawPublicContact[] | PrivatePractitioner[];
  public consolidatedCases?: ConsolidatedCaseSummary[];

  constructor(
    rawPublicCase: RawPublicCase,
    options: { authorizedUser: UnknownAuthUser },
  ) {
    if (options) {
      rawPublicCase = new PublicCase(rawPublicCase, options).toRawObject();
    }

    this.canAllowDocumentService = rawPublicCase.canAllowDocumentService;
    this.canAllowPrintableDocketRecord =
      rawPublicCase.canAllowPrintableDocketRecord;
    this.canDojPractitionersRepresentParty =
      rawPublicCase.canDojPractitionersRepresentParty;
    this.caseCaption = rawPublicCase.caseCaption;
    this.createdAt = rawPublicCase.createdAt;
    this.leadDocketNumber = rawPublicCase.leadDocketNumber;
    this.docketNumber = rawPublicCase.docketNumber;
    this.docketNumberSuffix = rawPublicCase.docketNumberSuffix;
    this.docketNumberWithSuffix = rawPublicCase.docketNumberWithSuffix;
    this.hasIrsPractitioner = rawPublicCase.hasIrsPractitioner;
    this.docketEntries = rawPublicCase.docketEntries;
    this.isPaper = rawPublicCase.isPaper;
    this.partyType = rawPublicCase.partyType;
    this.receivedAt = rawPublicCase.receivedAt;
    this.isSealed = rawPublicCase.isSealed;
    this.petitioners = rawPublicCase.petitioners;
    this.irsPractitioners = rawPublicCase.irsPractitioners;
    this.privatePractitioners = rawPublicCase.privatePractitioners;
    this.consolidatedCases = rawPublicCase.consolidatedCases;
  }
}
