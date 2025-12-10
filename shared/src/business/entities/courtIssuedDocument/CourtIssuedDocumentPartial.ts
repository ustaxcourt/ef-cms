import { CourtIssuedDocument } from '@shared/business/entities/courtIssuedDocument/CourtIssuedDocumentConstants';

export class CourtIssuedDocumentPartial extends CourtIssuedDocument {
  constructor(rawProps) {
    super('CourtIssuedDocumentBase');

    this.affectedDocketEntries = rawProps.affectedDocketEntries;
    this.attachments = rawProps.attachments || false;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
  }

  getValidationRules() {
    return CourtIssuedDocumentPartial.VALIDATION_RULES;
  }

  getDocumentTitle() {
    return this.documentTitle;
  }
}
