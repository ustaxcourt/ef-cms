import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '@shared/business/entities/JoiValidationEntity';
import joi from 'joi';

export class InternalDocumentSearchResult extends JoiValidationEntity {
  public caseCaption: string;
  public docketEntryId: string;
  public docketNumber: string;
  public docketNumberWithSuffix: string;
  public documentTitle: string;
  public documentType?: string;
  public eventCode?: string;
  public filingDate?: string;
  public isCaseSealed?: boolean;
  public isDocketEntrySealed?: boolean;
  public isFileAttached?: boolean;
  public isStricken?: boolean;
  public judge?: string;
  public numberOfPages?: number;
  public sealedDate?: string;
  public signedJudgeName?: string;

  constructor(rawProps) {
    super('InternalDocumentSearchResult');

    this.caseCaption = rawProps.caseCaption;
    this.docketEntryId = rawProps.docketEntryId;
    this.docketNumber = rawProps.docketNumber;
    this.docketNumberWithSuffix = rawProps.docketNumberWithSuffix;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.isCaseSealed = rawProps.isCaseSealed;
    this.isDocketEntrySealed = rawProps.isDocketEntrySealed;
    this.isFileAttached = rawProps.isFileAttached;
    this.isStricken = rawProps.isStricken;
    this.judge = rawProps.judge;
    this.numberOfPages = rawProps.numberOfPages;
    this.sealedDate = rawProps.sealedDate;
    this.signedJudgeName = rawProps.signedJudgeName;
  }

  static VALIDATION_RULES = {
    caseCaption:
      JoiValidationConstants.STRING.description('The case caption').required(),
    docketEntryId: JoiValidationConstants.UUID.description(
      'The UUID of the corresponding document in S3',
    ).required(),
    docketNumber: JoiValidationConstants.DOCKET_NUMBER.required(),
    docketNumberWithSuffix: JoiValidationConstants.STRING,
    documentTitle: JoiValidationConstants.DOCUMENT_TITLE.required(),
    documentType: JoiValidationConstants.STRING,
    eventCode: JoiValidationConstants.STRING,
    isCaseSealed: joi.boolean(),
    isDocketEntrySealed: joi.boolean(),
    isFileAttached: joi.boolean(),
    isStricken: joi.boolean(),
    judge: JoiValidationConstants.STRING.optional().allow(null),
    numberOfPages: joi.number().integer().optional().allow(null),
    sealedDate: JoiValidationConstants.ISO_DATE,
    signedJudgeName: JoiValidationConstants.STRING.optional().allow(null),
  };

  x;
  static DOCUMENT_SEARCH_PAGE_LOAD_SIZE = 6;

  getValidationRules() {
    return InternalDocumentSearchResult.VALIDATION_RULES;
  }
}

export type RawInternalDocumentSearchResult =
  ExcludeMethods<InternalDocumentSearchResult>;
