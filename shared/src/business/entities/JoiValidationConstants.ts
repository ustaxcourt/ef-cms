import {
  BAR_NUMBER_MATCHER,
  CAV_AND_SUBMITTED_CASE_STATUS,
  CURRENT_YEAR,
  DOCKET_NUMBER_MATCHER,
  DOCKET_NUMBER_SEARCH_MATCHER,
  MAX_FILE_SIZE_BYTES,
  MOTION_DISPOSITIONS,
} from './EntityConstants';
import { JoiDate } from '@joi/date';
import joiImported, { Root } from 'joi';

const joi: Root = joiImported.extend(JoiDate);

// These are specific to joi/@joi/date (dayjs) and cannot be shared with luxon.
// @joi/date@3 uses dayjs: a trailing literal Z must be escaped as [Z]
// (moment treated bare Z as UTC; dayjs does not). ISO timestamps must set
// utc: true on format() so dayjs parses the value as UTC instead of local time.
/** ISO-8601 timestamp format accepted by DAWSON persistence (UTC, literal Z suffix). */
export const ISO_DATE_FORMAT_STRING = 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';

/** Pass to `joi.date().iso().format(...)` for UTC ISO timestamps (@joi/date 3 / dayjs). */
export const ISO_DATE_JOI_FORMAT = {
  format: ISO_DATE_FORMAT_STRING,
  utc: true,
} as const;

const DATE_FORMATS = {
  ISO: ISO_DATE_FORMAT_STRING,
  MMDDYYYY: 'MM/DD/YYYY',
  YYYYMMDD: 'YYYY-MM-DD',
};

// if repeatedly using the same rules to validate how an input should be formatted, capture it here.
const STRING = joi.string().min(1);

export const JoiValidationConstants = Object.freeze({
  BAR_NUMBER: STRING.regex(BAR_NUMBER_MATCHER).max(10),
  CASE_CAPTION: STRING.max(4700),
  DATE: joi.date().iso().format([DATE_FORMATS.YYYYMMDD]),
  DATE_RANGE_PICKER_DATE: joi.date().iso().format([DATE_FORMATS.MMDDYYYY]),
  DOCKET_NUMBER: STRING.regex(DOCKET_NUMBER_MATCHER),
  DOCKET_NUMBER_SEARCH: STRING.regex(DOCKET_NUMBER_SEARCH_MATCHER),
  DOCKET_RECORD: joi
    .array()
    .unique(
      (a, b) =>
        a.index !== undefined && b.index !== undefined && a.index === b.index,
    ),
  DOCUMENT_TITLE: STRING.max(3000),
  EMAIL: STRING.email({ tlds: false }).max(100),
  ISO_DATE: joi.date().iso().format(ISO_DATE_JOI_FORMAT),
  JUDGES_STATUSES: joi.array().items(
    joi
      .string()
      .required()
      .valid(...CAV_AND_SUBMITTED_CASE_STATUS),
  ),
  MAX_FILE_SIZE_BYTES: joi.number().integer().min(1).max(MAX_FILE_SIZE_BYTES),
  RELATED_DOCKET_ENTRY: {
    disposition: joi
      .string()
      .required()
      .valid(...Object.values(MOTION_DISPOSITIONS))
      .messages({ '*': 'Requires a disposition' }),
    docketEntryId: joi
      .string()
      .required()
      .messages({ '*': 'Requires a Motion' }),
  },
  STRING,
  TWENTYFOUR_HOUR_MINUTES: STRING.regex(
    /^(([0-1][0-9])|([2][0-3])):([0-5][0-9])$/,
  ),
  US_POSTAL_CODE: STRING.regex(/^(\d{5}|\d{5}-\d{4})$/),
  UUID: STRING.uuid(),
  YEAR_MAX_CURRENT: joi.number().integer().min(1900).max(CURRENT_YEAR),
});
