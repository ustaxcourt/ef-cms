import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import { OPINION_EVENT_CODES_WITH_BENCH_OPINION } from '../../entities/EntityConstants';
import joi from 'joi';

export class PublicDocumentSearchResult extends JoiValidationEntity {
  public caseCaption!: string;
  public docketEntryId!: string;
  public docketNumber!: string;
  public docketNumberWithSuffix?: string;
  public documentTitle!: string;
  public documentType?: string;
  public eventCode?: string;
  public filingDate?: string;
  public isSealed?: boolean;
  public isStricken?: boolean;
  public judge?: string;
  public numberOfPages?: number;
  public sealedDate?: string;
  public signedJudgeName?: string;

  constructor(rawProps) {
    super('PublicDocumentSearchResult');
    if (!rawProps) return;

    this.caseCaption = rawProps.caseCaption;
    this.docketEntryId = rawProps.docketEntryId;
    this.docketNumber = rawProps.docketNumber;
    this.docketNumberWithSuffix = rawProps.docketNumberWithSuffix;
    this.documentTitle = rawProps.documentTitle;
    this.documentType = rawProps.documentType;
    this.eventCode = rawProps.eventCode;
    this.filingDate = rawProps.filingDate;
    this.isSealed = rawProps.isSealed;
    this.isStricken = rawProps.isStricken;
    this.judge = rawProps.judge;
    this.numberOfPages = rawProps.numberOfPages;
    this.sealedDate = rawProps.sealedDate;
    this.signedJudgeName = rawProps.signedJudgeName;
  }

  static DOCUMENT_SEARCH_PAGE_LOAD_SIZE = 6;

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
    eventCode: joi
      .when('isSealed', {
        is: true,
        otherwise: JoiValidationConstants.STRING,
        then: JoiValidationConstants.STRING.valid(
          ...OPINION_EVENT_CODES_WITH_BENCH_OPINION,
        ),
      })
      .messages({
        '*': 'Sealed documents cannot be returned in public searches unless they are of type opinion',
      }),
    isSealed: joi.boolean(),
    isStricken: joi.boolean().invalid(true).messages({
      '*': 'Stricken documents cannot be returned in public searches.',
    }),
    judge: JoiValidationConstants.STRING.optional(),
    numberOfPages: joi.number().integer().optional().allow(null),
    sealedDate: JoiValidationConstants.ISO_DATE,
    signedJudgeName: JoiValidationConstants.STRING.optional(),
  };

  getValidationRules() {
    return PublicDocumentSearchResult.VALIDATION_RULES;
  }
}

export type RawPublicDocumentSearchResult =
  ExcludeMethods<PublicDocumentSearchResult>;
