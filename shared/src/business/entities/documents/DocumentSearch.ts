import { DATE_RANGE_SEARCH_OPTIONS } from '../EntityConstants';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { JoiValidationEntity } from '../JoiValidationEntity';
import {
  calculateISODate,
  createEndOfDayISO,
  createStartOfDayISO,
} from '../../utilities/DateHandler';
import joi from 'joi';

export class DocumentSearch extends JoiValidationEntity {
  public judge?: string;
  public from: number;
  public userRole?: string;
  public keyword?: string;
  public docketNumber: string;
  public dateRange?: string;
  public caseTitleOrPetitioner?: string;
  public endDate?: string;
  public startDate?: string;
  public tomorrow?: string;

  constructor(rawProps: any = {}) {
    super('DocumentSearch');

    this.judge = rawProps.judge;
    this.from = rawProps.from ?? 0;
    this.userRole = rawProps.userRole;
    this.keyword = rawProps.keyword;
    this.docketNumber = rawProps.docketNumber;
    this.dateRange = rawProps.dateRange;
    this.caseTitleOrPetitioner = rawProps.caseTitleOrPetitioner;

    if (rawProps.startDate) {
      const [month, day, year] = rawProps.startDate.split('/'); // 11/31/2019
      if (month && day && year) {
        this.startDate = createStartOfDayISO({
          day,
          month,
          year,
        });
      }
    }

    if (rawProps.endDate) {
      const [month, day, year] = rawProps.endDate.split('/');
      if (month && day && year) {
        this.endDate = createEndOfDayISO({
          day,
          month,
          year,
        });
        this.tomorrow = calculateISODate({
          howMuch: +1,
          units: 'days',
        });
      }
    }
  }

  static DOCUMENT_SEARCH_PAGE_LOAD_SIZE = 6;

  static JOI_VALID_DATE_SEARCH_FORMATS = [
    'YYYY/MM/DD',
    'YYYY/MM/D',
    'YYYY/M/DD',
    'YYYY/M/D',
    'YYYY-MM-DDTHH:mm:ss.SSSZ',
  ] as const;

  static VALIDATION_RULES = joi
    .object()
    .keys({
      caseTitleOrPetitioner: JoiValidationConstants.STRING.allow(
        '',
      ).description(
        'The case title or petitioner name to filter the search results by',
      ),
      dateRange: JoiValidationConstants.STRING.allow('').optional(),
      docketNumber: JoiValidationConstants.STRING.allow('').description(
        'The docket number to filter the search results by',
      ),
      endDate: joi.alternatives().conditional('startDate', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.ISO_DATE.format(
          DocumentSearch.JOI_VALID_DATE_SEARCH_FORMATS,
        )
          .less(joi.ref('tomorrow'))
          .optional()
          .description(
            'The end date search filter is not required if there is no start date',
          ),
        then: JoiValidationConstants.ISO_DATE.format(
          DocumentSearch.JOI_VALID_DATE_SEARCH_FORMATS,
        )
          .less(joi.ref('tomorrow'))
          .min(joi.ref('startDate'))
          .optional()
          .description(
            'The end date search filter must be greater than or equal to the start date, and less than or equal to the current date',
          ),
      }),
      from: joi
        .number()
        .integer()
        .min(0)
        .required()
        .description(
          'The zero-based index representing which page of results we are requesting',
        ),
      judge: JoiValidationConstants.STRING.allow('')
        .optional()
        .description('The name of the judge to filter the search results by'),
      keyword: JoiValidationConstants.STRING.optional()
        .allow('')
        .description('The keyword to search by'),
      startDate: joi.alternatives().conditional('dateRange', {
        is: DATE_RANGE_SEARCH_OPTIONS.CUSTOM_DATES,
        otherwise: joi.forbidden(),
        then: JoiValidationConstants.ISO_DATE.format(
          DocumentSearch.JOI_VALID_DATE_SEARCH_FORMATS,
        )
          .max('now')
          .required()
          .description(
            'The start date to search by, which cannot be greater than the current date, and is required when there is an end date provided',
          ),
      }),
      tomorrow: joi
        .optional()
        .description(
          'The computed value to validate the endDate against, in order to verify that the endDate is less than or equal to the current date',
        ),
      userRole: JoiValidationConstants.STRING.allow('')
        .optional()
        .description('The role of the user performing the search'),
    })
    .oxor('caseTitleOrPetitioner', 'docketNumber')
    .messages({
      'object.oxor':
        'Enter either a Docket number or a Case name/Petitioner name, not both',
    });

  static VALIDATION_ERROR_MESSAGES = {
    endDate: [
      {
        contains: 'must be less than',
        message: 'End date cannot be in the future. Enter valid end date.',
      },
      'Enter a valid end date',
    ],
    startDate: [
      {
        contains: 'must be less than or equal to "now"',
        message: 'Start date cannot be in the future. Enter valid start date.',
      },
      'Enter a valid start date',
    ],
  } as const;

  getValidationRules() {
    return DocumentSearch.VALIDATION_RULES;
  }

  getErrorToMessageMap() {
    return DocumentSearch.VALIDATION_ERROR_MESSAGES;
  }
}

export type RawDocumentSearch = ExcludeMethods<DocumentSearch>;
