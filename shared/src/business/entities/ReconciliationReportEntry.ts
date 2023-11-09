import { DOCKET_ENTRY_VALIDATION_RULES } from './EntityValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import { pick } from 'lodash';

export class ReconciliationReportEntry extends JoiValidationEntity {
  public caseCaption: string;
  public docketEntryId: string;
  public docketNumber: string;
  public documentTitle: string;
  public eventCode: string;
  public isFileAttached: string;
  public filedBy: string;
  public filingDate: string;
  public index: string;
  public servedAt: string;
  public servedPartiesCode: string;

  constructor(rawDocketEntry) {
    super('ReconciliationReportEntry');

    this.caseCaption = rawDocketEntry.caseCaption;
    this.docketEntryId = rawDocketEntry.docketEntryId;
    this.docketNumber = rawDocketEntry.docketNumber;
    this.documentTitle = rawDocketEntry.documentTitle;
    this.eventCode = rawDocketEntry.eventCode;
    this.isFileAttached = rawDocketEntry.isFileAttached;
    this.filedBy = rawDocketEntry.filedBy;
    this.filingDate = rawDocketEntry.filingDate;
    this.index = rawDocketEntry.index;
    this.servedAt = rawDocketEntry.servedAt;
    this.servedPartiesCode = rawDocketEntry.servedPartiesCode;
  }

  getValidationRules() {
    return pick(DOCKET_ENTRY_VALIDATION_RULES, [
      'caseCaption',
      'docketEntryId',
      'docketNumber',
      'documentTitle',
      'eventCode',
      'isFileAttached',
      'filedBy',
      'filingDate',
      'index',
      'servedAt',
      'servedPartiesCode',
    ]);
  }
}

export type RawReconciliationReportEntry =
  ExcludeMethods<ReconciliationReportEntry>;
