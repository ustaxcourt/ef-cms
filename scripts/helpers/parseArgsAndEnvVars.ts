import {
  FORMATS,
  formatDateString,
  formatNow,
} from '@shared/business/utilities/DateHandler';
import { type ParseArgsConfig, parseArgs } from 'node:util';
import { missingEnvironmentVariables } from '../../shared/admin-tools/util';
import path from 'node:path';

export type ScriptConfig = {
  environment?: {
    /**
     * List of environment variables that are required to be present.
     * The key is the property by which the parsed value will be
     * returned and the value is the environment variable name
     * (e.g. `env: 'ENV'`).
     */
    [key: string]: string;
  };
  /**
   * The `description` will be printed to the console when errors are
   * encountered or when the `--help` or `--verbose` parameters are provided.
   */
  description?: string;
  parameters?: {
    /**
     * List of required and optional parameters. If the `long` and `position`
     * properties are not defined in the `ScriptParameter` object, the
     * parameter is called by its key prefixed with two dashes (e.g. `--year`).
     * The key is the property by which the parsed value will be returned.
     */
    [key: string]: ScriptParameter;
  };
  /**
   * The `requireActiveAwsSession` property indicates whether the AWS session
   * token should be currently active.
   */
  requireActiveAwsSession?: boolean;
};

export type ScriptParameter = {
  /**
   * Only compatible with 'string' types, the `commaDelimited` property
   * indicates that the provided value might be several comma-delimited
   * values. When `true`, the value returned by `parseArguments` will
   * always be an array, even if only one value was provided.
   */
  commaDelimited?: boolean;
  /**
   * The `description` property may be utilized to provide additional
   * context for a parameter, such as the expected format of the value.
   */
  description?: string;
  /**
   * If no value is provided for this parameter, `parseArguments` will
   * return this default value.
   */
  default?: string | boolean | string[];
  /**
   * The `long` property is only necessary if you want to call the parameter
   * (e.g. `--event-code`) differently from how want you get it back
   * (e.g. `eventCode`) from `parseArguments`.
   */
  long?: string;
  /**
   * The `multiple` property indicates that this parameter may be provided
   * more than once. When `true`, the value returned by `parseArguments`
   * will always be an array, even if only one value was provided.
   */
  multiple?: boolean;
  /**
   * Only compatible with 'string' types, the `position` property indicates
   * the order in which this parameter appears.
   */
  position?: number;
  /**
   * Only compatible with 'string' types, the `required` property indicates
   * that a value is required to be provided for this parameter.
   */
  required?: boolean;
  /**
   * The `short` property allows this parameter to optionally be called
   * prefixed with a single dash (e.g. `-t`).
   */
  short?: string;
  /**
   * Only compatible with 'string' types, the `transform` property indicates
   * how the value(s) should be transformed by `parseArguments` before they
   * are returned.
   */
  transform?: 'number' | 'toLowerCase' | 'toUpperCase';
  /**
   * The `type` property indicates to `parseArguments` how to expect to
   * find the provided value. For 'boolean' types, the presence or absence
   * of the parameter indicates 'true' or 'false', respectively.
   */
  type: 'string' | 'boolean';
};

export const parseInts = (ints: string, delimiter = ','): number[] => {
  return ints
    .split(delimiter)
    .filter(s => s.length)
    .map(s => parseInt(s));
};

export const parseIntRange = (intRange: string): number[] => {
  const ints = intRange
    .split('-')
    .filter(s => s.length)
    .map(s => parseInt(s));
  const min = Math.min(...ints);
  const max = Math.max(...ints);
  const rangeNums: number[] = [];
  for (let i = min; i <= max; i++) {
    rangeNums.push(i);
  }
  return rangeNums;
};

// supports:
//   a string containing an integer (e.g. '1')
//   comma-delimited list of integers (e.g. '1,2,3')
//   inclusive range of integers (e.g. '1-3')
//   mix of comma-delimited list and range of integers (e.g. '1,3-5,7-9')
export const parseIntsArg = (intstr: string): number[] => {
  const ints: number[] = [];
  const commaDelimitedSegments = intstr.split(',').filter(s => s.length);
  for (const segment of commaDelimitedSegments) {
    if (segment.indexOf('-') > 0) {
      ints.push(...parseIntRange(segment));
    } else {
      ints.push(parseInt(segment));
    }
  }
  return [...new Set(ints.sort((a, b) => a - b))];
};

const collateArguments = (parameters: {
  [key: string]: ScriptParameter;
}): {
  requiredPositionals: ScriptParameter[];
  requiredParameters: ScriptParameter[];
  optionalPositionals: ScriptParameter[];
  optionalParameters: ScriptParameter[];
} => {
  const allPositionals: ScriptParameter[] = [];
  const requiredParameters: ScriptParameter[] = [];
  const optionalParameters: ScriptParameter[] = [];
  for (const varName in parameters) {
    const paramConfig = parameters[varName];
    if (
      'position' in paramConfig &&
      typeof paramConfig.position !== 'undefined'
    ) {
      allPositionals.push({ ...paramConfig, long: varName });
    } else {
      if (paramConfig.required && paramConfig.type === 'string') {
        requiredParameters.push({ ...paramConfig, long: varName });
      } else {
        optionalParameters.push({ ...paramConfig, long: varName });
      }
    }
  }
  const reverseSortedRequiredPositionals: ScriptParameter[] = [];
  const reverseSortedOptionalPositionals: ScriptParameter[] = [];
  const reverseSortedPositionals = allPositionals.sort(
    (a, b) => b.position! - a.position!,
  );
  let requiredOverride = false;
  for (const positional of reverseSortedPositionals) {
    if (positional.required || requiredOverride) {
      requiredOverride = true;
      reverseSortedRequiredPositionals.push(positional);
    } else {
      reverseSortedOptionalPositionals.push(positional);
    }
  }
  const requiredPositionals = reverseSortedRequiredPositionals
    .sort((a, b) => a.position! - b.position!)
    .map(p => ({ ...p, required: true }));
  const optionalPositionals = reverseSortedOptionalPositionals.sort(
    (a, b) => a.position! - b.position!,
  );
  return {
    optionalParameters,
    optionalPositionals,
    requiredParameters,
    requiredPositionals,
  };
};

const getRelativePath = (scriptFullPath: string): string => {
  const repoRootDir = path.dirname(__filename).replace('/scripts/helpers', '');
  return scriptFullPath.replace(repoRootDir, '.');
};

const buildExample = (parameters: {
  [key: string]: ScriptParameter;
}): string => {
  let example = getRelativePath(process.argv[1]);
  const {
    optionalParameters,
    optionalPositionals,
    requiredParameters,
    requiredPositionals,
  } = collateArguments(parameters);
  if (requiredPositionals.length) {
    example += requiredPositionals.map(p => ` <${p.long!}>`).join('');
  }
  if (requiredParameters.length) {
    example += requiredParameters
      .map(p => ` ${p.short ? '-' + p.short : '--' + p.long!} <${p.long!}>`)
      .join('');
  }
  if (optionalPositionals.length || optionalParameters.length) {
    example += ' [';
    if (optionalPositionals.length) {
      example += optionalPositionals.map(p => ` <${p.long}>`).join('');
    }
    if (optionalParameters.length) {
      example += optionalParameters
        .map(
          p =>
            ` ${p.short ? '-' + p.short : '--' + p.long!}${p.type !== 'boolean' ? ' <' + p.long! + '>' : ''}`,
        )
        .join('');
    }
    example += ' ]';
  }
  return example;
};

const usage = (sc: ScriptConfig, warning?: string): void => {
  const example = buildExample(sc.parameters!);
  if (warning) {
    console.log(`${warning}\n`);
  }
  if (sc.description?.length) {
    console.log(`${sc.description}\n`);
  }
  console.log(`Usage: ${example}\n`);
  console.log('Parameters:', sc.parameters);
  if (sc.environment) {
    console.log(
      '\nRequired Environment Variables:',
      Object.values(sc.environment),
    );
  }
  if (sc.requireActiveAwsSession) {
    console.log('\nActive AWS session required.');
  }
};

const showErrorAndExit = (
  errorMessage: string,
  sc: ScriptConfig,
  verbose: boolean,
): void => {
  if (verbose) {
    console.log(errorMessage);
  } else {
    usage(sc, errorMessage);
  }
  process.exit(1);
};

const buildParseArgsConfigObject = (parameters: {
  [key: string]: ScriptParameter;
}): ParseArgsConfig => {
  const options = {} as const;
  const defaultOptions = {
    help: {
      default: false,
      short: 'h',
      type: 'boolean',
    },
  };
  const argConfig = {
    allowPositionals: false,
    options,
    strict: true,
  };
  for (const varName in parameters) {
    const paramConfig = parameters[varName];
    const { multiple, short, type } = paramConfig;
    const defaultValue = type === 'boolean' ? false : paramConfig.default;
    // parseArgs doesn't distinguish longName from varName like we do
    const param = paramConfig.long?.length ? paramConfig.long : varName;
    if (
      'position' in paramConfig &&
      typeof paramConfig.position !== 'undefined'
    ) {
      argConfig.allowPositionals = true;
    }
    const paramOptions = { type };
    if (defaultValue) {
      paramOptions['default'] = defaultValue;
    }
    if (multiple) {
      paramOptions['multiple'] = multiple;
    }
    if (short) {
      paramOptions['short'] = short;
    }
    options[param] = { ...paramOptions } as const;
  }
  if (!Object.values(parameters).find(p => p.short && p.short === 'h')) {
    options['help'] = { ...defaultOptions.help } as const;
  }

  return { ...argConfig } as const as ParseArgsConfig;
};

const showHelpAndVerbose = (
  sc: ScriptConfig,
  positionals: string[],
  values: {
    [k: string]: string | boolean | (string | boolean)[] | undefined;
  },
): void => {
  if (values.verbose) {
    usage(sc, 'Verbose output enabled');
    console.log('positionals:', positionals);
    console.log('values:', values);
  }
  if (values.help) {
    if (!values.verbose) {
      usage(sc);
    }
    process.exit(0);
  }
};

const rawParseArgs = (
  config: ParseArgsConfig,
  sc: ScriptConfig,
): {
  positionals: string[];
  values: {
    [k: string]: string | boolean | (string | boolean)[] | undefined;
  };
} => {
  let positionals: string[];
  let values: {
    [k: string]: string | boolean | (string | boolean)[] | undefined;
  };

  // the arguments were cached at the time we imported node:util
  // to facilitate testing we'll set them now in case they've changed
  config.args = process.argv.slice(2);

  try {
    ({ positionals, values } = parseArgs(config));
  } catch (ex) {
    usage(sc, `Error: ${ex}`);
    process.exit(1);
  }
  return { positionals, values };
};

const splitValueIntoArrayOfStrings = (
  value: string | number | (string | boolean | number)[],
  commaDelimited: boolean | undefined,
): string[] => {
  const strings: string[] = [];
  if (typeof value === 'string' || typeof value === 'number') {
    value = [`${value}`];
  }
  for (const aVal of value) {
    if (commaDelimited) {
      strings.push(...`${aVal}`.split(','));
    } else {
      strings.push(`${aVal}`);
    }
  }
  return strings;
};

const transformStrings = (
  strings: string[],
  transform?: string,
): (string | number)[] => {
  const transformed: (number | string)[] = [];
  if (transform) {
    for (const aVal of strings) {
      switch (transform) {
        case 'number':
          transformed.push(...parseIntsArg(aVal));
          break;
        case 'toLowerCase':
          transformed.push(aVal.toLowerCase());
          break;
        case 'toUpperCase':
          transformed.push(aVal.toUpperCase());
          break;
      }
    }
  } else {
    transformed.push(...strings);
  }
  return transformed;
};

const buildStringValue = (
  value: string | number | (string | number | boolean)[],
  paramConfig: ScriptParameter,
) => {
  const strings = splitValueIntoArrayOfStrings(
    value,
    paramConfig.commaDelimited,
  );
  let returnVal: string | number | (string | number)[] = transformStrings(
    strings,
    paramConfig.transform,
  );
  if (!paramConfig.commaDelimited && !paramConfig.multiple) {
    returnVal = returnVal[0];
  }
  return returnVal;
};

const parseAndTransformValues = (
  sc: ScriptConfig,
  positionals: string[],
  values: {
    [k: string]: string | boolean | (string | boolean)[] | undefined;
  },
): { [k: string]: string | string[] | boolean | number | number[] } => {
  const parsedParameters = {};
  for (const varName in sc.parameters) {
    const paramConfig = sc.parameters[varName];
    // parseArgs doesn't distinguish longName from varName like we do
    const longName = paramConfig.long?.length ? paramConfig.long : varName;
    let value:
      | string
      | boolean
      | number
      | (string | boolean | number)[]
      | undefined = paramConfig.default;
    if (
      'position' in paramConfig &&
      typeof paramConfig.position !== 'undefined'
    ) {
      value = positionals[paramConfig.position];
    } else {
      if (longName in values) {
        value = values[longName];
      }
    }
    if (paramConfig.type === 'string' && value && typeof value !== 'boolean') {
      value = buildStringValue(value, paramConfig);
    }
    parsedParameters[varName] = value;
  }
  return parsedParameters;
};

const validateParsedValues = (
  sc: ScriptConfig,
  parsedValues: {
    [k: string]: string | string[] | boolean | number | number[];
  },
  verbose: boolean,
): void => {
  const { optionalPositionals, requiredParameters, requiredPositionals } =
    collateArguments(sc.parameters!);
  const allPositionals = [...requiredPositionals, ...optionalPositionals];
  if (allPositionals.length) {
    const positionsReversed = [...requiredPositionals, ...optionalPositionals]
      .map(p => p.position)
      .filter(p => p || p === 0)
      .sort((a, b) => b! - a!);
    const uniquePositions = [...new Set(positionsReversed)];
    if (
      uniquePositions.length !== positionsReversed.length ||
      positionsReversed[0] !== uniquePositions.length - 1
    ) {
      showErrorAndExit(
        'Invalid positionals: positions must be sequential starting at 0',
        sc,
        verbose,
      );
    }
  }
  for (const requiredParam of [...requiredPositionals, ...requiredParameters]) {
    const longName = requiredParam.long!;
    if (!(longName in parsedValues) || !parsedValues[longName]) {
      showErrorAndExit(`Invalid input: expected ${longName}`, sc, verbose);
    }
  }
};

const requireEnvironmentVariables = (
  sc: ScriptConfig,
  verbose: boolean,
): void => {
  if (sc.environment) {
    const missing = missingEnvironmentVariables(Object.values(sc.environment));
    if (missing.length > 0) {
      showErrorAndExit(
        `Missing environment variable${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`,
        sc,
        verbose,
      );
    }
  }
};

export const getEnvironmentVariables = (environment?: {
  [key: string]: string;
}): { [key: string]: string } => {
  const ret: { [key: string]: string } = {};
  if (environment) {
    for (const varName in environment) {
      ret[varName] = process.env[environment[varName]]!;
    }
  }
  return ret;
};

const checkAwsSessionExpiration = (
  sc: ScriptConfig,
  verbose: boolean,
): void => {
  const { awsSessionExpiration, ci } = getEnvironmentVariables({
    awsSessionExpiration: 'AWS_SESSION_EXPIRATION',
    ci: 'CI',
  });
  if (ci) {
    return;
  }
  if (!awsSessionExpiration || awsSessionExpiration.length === 0) {
    showErrorAndExit('AWS session has expired', sc, verbose);
  }
  const awsSessionExpirationSeconds = Number(
    formatDateString(awsSessionExpiration, FORMATS.UNIX_TIMESTAMP_SECONDS),
  );
  const now = Number(formatNow(FORMATS.UNIX_TIMESTAMP_SECONDS));
  if (awsSessionExpirationSeconds < now) {
    showErrorAndExit(
      `AWS session expired ${awsSessionExpiration}`,
      sc,
      verbose,
    );
  }
  if (verbose) {
    console.log(`AWS session will expire ${awsSessionExpiration}`);
  }
};

export const parseArgsAndEnvVars = (
  sc: ScriptConfig,
): { [k: string]: string | string[] | boolean | number | number[] } => {
  if (!sc.parameters) {
    sc.parameters = {};
  }
  if (!Object.values(sc.parameters).find(p => p.short && p.short === 'v')) {
    sc.parameters.verbose = { default: false, short: 'v', type: 'boolean' };
  }

  const config = buildParseArgsConfigObject(sc.parameters);
  const { positionals, values } = rawParseArgs(config, sc);

  showHelpAndVerbose(sc, positionals, values);

  const parsedParameters = parseAndTransformValues(sc, positionals, values);
  if (parsedParameters.verbose) {
    console.log('parsed arguments:', parsedParameters);
  }
  validateParsedValues(sc, parsedParameters, !!parsedParameters.verbose);

  requireEnvironmentVariables(sc, !!parsedParameters.verbose);
  const environmentVariables = getEnvironmentVariables(sc.environment);
  if (parsedParameters.verbose) {
    console.log('environment variables:', environmentVariables);
  }

  if (sc.requireActiveAwsSession) {
    checkAwsSessionExpiration(sc, !!parsedParameters.verbose);
  }

  return { ...environmentVariables, ...parsedParameters };
};
