import { Case } from './cases/Case';
import { JoiValidationConstants } from './JoiValidationConstants';
import { JoiValidationEntity } from './JoiValidationEntity';
import { createISODateString } from '../utilities/DateHandler';
import joi from 'joi';

export class CaseDeadline extends JoiValidationEntity {
  public associatedJudge: string;
  public caseDeadlineId: string;
  public createdAt: string;
  public deadlineDate: string;
  public description: string;
  public docketNumber: string;
  public sortableDocketNumber: number;
  public leadDocketNumber?: string;

  constructor(rawProps, { applicationContext }) {
    super('CaseDeadline');

    if (!applicationContext) {
      throw new TypeError('applicationContext must be defined');
    }

    this.associatedJudge = rawProps.associatedJudge;
    this.caseDeadlineId =
      rawProps.caseDeadlineId || applicationContext.getUniqueId();
    this.createdAt = rawProps.createdAt || createISODateString();
    this.deadlineDate = rawProps.deadlineDate;
    this.description = rawProps.description;
    this.docketNumber = rawProps.docketNumber;
    this.leadDocketNumber = rawProps.leadDocketNumber;
    this.sortableDocketNumber =
      rawProps.sortableDocketNumber ||
      Case.getSortableDocketNumber(this.docketNumber);
  }

  static VALIDATION_ERROR_MESSAGES = {
    associatedJudge: 'Associated judge is required',
    deadlineDate: 'Enter a valid deadline date',
    description: [
      {
        contains: 'length must be less than or equal to',
        message:
          'The description is too long. Please enter a valid description.',
      },
      'Enter a description of this deadline',
    ],
    docketNumber: 'You must have a docket number.',
    sortableDocketNumber: 'Sortable docket number is required',
  };

  getErrorToMessageMap() {
    return CaseDeadline.VALIDATION_ERROR_MESSAGES;
  }

  getValidationRules() {
    return {
      associatedJudge: JoiValidationConstants.STRING.max(50)
        .required()
        .description(
          'Judge assigned to the case containing this Case Deadline.',
        ).messages(setDefaultErrorMessage('Associated judge is required')),
      caseDeadlineId: JoiValidationConstants.UUID.required().description(
        'Unique Case Deadline ID only used by the system.',
      ),
      createdAt: JoiValidationConstants.ISO_DATE.required().description(
        'When the Case Deadline was added to the system.',
      ),
      deadlineDate: JoiValidationConstants.ISO_DATE.required().description(
        'When the Case Deadline expires.',
      )
      .messages(setDefaultErrorMessage('Enter a valid deadline date')),,
      description: JoiValidationConstants.STRING.max(120)
        .min(1)
        .required()
        .description('User provided description of the Case Deadline.'),
        .messages({
          ...setDefaultErrorMessage('Enter a description of this deadline'),
          'string.max': 'The description is too long. Please enter a valid description.',
        }),
      docketNumber: JoiValidationConstants.DOCKET_NUMBER.required().description(
        'Docket number of the case containing the Case Deadline.',
      ),
      entityName:
        JoiValidationConstants.STRING.valid('CaseDeadline').required(),
      leadDocketNumber: JoiValidationConstants.DOCKET_NUMBER.optional(),
      sortableDocketNumber: joi
        .number()
        .required()
        .description(
          'A sortable representation of the docket number of the case containing the Case Deadline.',
        ).messages(setDefaultErrorMessage('Sortable docket number is required')),
    };
  }
}

export type RawCaseDeadline = ExcludeMethods<CaseDeadline>;



const joiErrorKeys = [
  'any.type',
  'any.allow',
  'any.alter',
  'any.artifact',
  'any.cache',
  'any.cast',
  'any.concat',
  'any.custom',
  'any.default',
  'any.describe',
  'any.description',
  'any.empty',
  'any.error',
  'any.example',
  'any.external',
  'any.extract',
  'any.failover',
  'any.forbidden',
  'any.fork',
  'any.id',
  'any.invalid',
  'any.keep',
  'any.label',
  'any.message',
  'any.messages',
  'any.meta',
  'any.note',
  'any.only',
  'any.optional',
  'any.prefs',
  'any.presence',
  'any.raw',
  'any.required',
  'any.result',
  'any.rule',
  'any.ruleset',
  'any.shared',
  'any.strict',
  'any.strip',
  'any.tag',
  'any.tailor',
  'any.unit',
  'any.valid',
  'any.validate',
  'any.validateAsync',
  'any.warn',
  'any.warning',
  'any.when',
  'alternatives.conditional',
  'alternatives.match',
  'alternatives.try',
  'array.has',
  'array.items',
  'array.length',
  'array.max',
  'array.min',
  'array.ordered',
  'array.single',
  'array.sort',
  'array.sparse',
  'array.unique',
  'binary.encoding',
  'binary.length',
  'binary.max',
  'binary.min',
  'boolean.falsy',
  'boolean.sensitive',
  'boolean.truthy',
  'date.greater',
  'date.iso',
  'date.less',
  'date.max',
  'date.min',
  'date.timestamp',
  'function.arity',
  'link.ref',
  'link.concat',
  'number.greater',
  'number.integer',
  'number.less',
  'number.max',
  'number.min',
  'number.multiple',
  'number.negative',
  'number.port',
  'number.positive',
  'number.precision',
  'number.sign',
  'number.unsafe',
  'object.and',
  'object.append',
  'object.assert',
  'object.instance',
  'object.keys',
  'object.length',
  'object.max',
  'object.min',
  'object.nand',
  'object.or',
  'object.oxor',
  'object.pattern',
  'object.ref',
  'object.regex',
  'object.rename',
  'object.schema',
  'object.unknown',
  'object.with',
  'object.without',
  'object.xor',
  'string.alphanum',
  'string.base64',
  'string.case',
  'string.creditCard',
  'string.dataUri',
  'string.domain',
  'string.email',
  'string.guid',
  'string.hex',
  'string.hostname',
  'string.insensitive',
  'string.ip',
  'string.isoDate',
  'string.isoDuration',
  'string.length',
  'string.lowercase',
  'string.max',
  'string.min',
  'string.normalize',
  'string.pattern',
  'string.pattern.base',
  'string.replace',
  'string.token',
  'string.trim',
  'string.truncate',
  'string.uppercase',
  'string.uri',
  'symbol.map',
  'alternatives.all',
  'alternatives.any',
  'alternatives.one',
  'alternatives.types',
  'any.ref',
  'any.unknown',
  'array.base',
  'array.excludes',
  'array.includesRequiredBoth',
  'array.includesRequiredKnowns',
  'array.includesRequiredUnknowns',
  'array.includes',
  'array.orderedLength',
  'array.hasKnown',
  'array.hasUnknown',
  'binary.base',
  'boolean.base',
  'date.base',
  'date.format',
  'date.strict',
  'function.class',
  'function.maxArity',
  'function.minArity',
  'number.base',
  'number.infinity',
  'object.base',
  'object.missing',
  'object.refType',
  'string.base',
  'string.empty',
  'string.hexAlign',
  'string.ipVersion',
  'string.uriCustomScheme',
  'string.uriRelativeOnly',
  'symbol.base',
];

type ErrorMessageOptions = {
  type?: string;
  keysToIgnore?: string[];
};

export function setDefaultErrorMessage(
  message: string,
  options?: ErrorMessageOptions,
): {
  [key: string]: string;
} {
  if (!options) {
    return { ['*']: message };
  }
  const defaultErrorMessage = {};
  const joiKeysToUse = joiErrorKeys
    .filter(key => {
      if (options?.type) return key.includes(options.type);
      return true;
    })
    .filter(key => {
      if (options?.keysToIgnore) return !options.keysToIgnore.includes(key);
      return true;
    });

  joiKeysToUse.forEach(key => {
    defaultErrorMessage[key] = message;
  });
  return defaultErrorMessage;
}
