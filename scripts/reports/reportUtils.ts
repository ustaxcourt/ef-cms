import { type ParseArgsConfig, parseArgs } from 'node:util';

export type ScriptConfig = {
  description: string;
  parameters: { [key: string]: ScriptParameter };
};

export type ScriptParameter = {
  commaDelimited?: boolean;
  description?: string;
  default?: string | boolean | string[];
  long?: string;
  multiple?: boolean;
  position?: number;
  required?: boolean;
  short?: string;
  transform?: 'number' | 'toLowerCase' | 'toUpperCase';
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
  let rangeNums: number[] = [];
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
    (a, b) => (b.position || 0) - (a.position || 0),
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
    .sort((a, b) => (a.position || 0) - (b.position || 0))
    .map(p => ({ ...p, required: true }));
  const optionalPositionals = reverseSortedOptionalPositionals.sort(
    (a, b) => (a.position || 0) - (b.position || 0),
  );
  return {
    optionalParameters,
    optionalPositionals,
    requiredParameters,
    requiredPositionals,
  };
};

const buildExample = (parameters: {
  [key: string]: ScriptParameter;
}): string => {
  const {
    optionalParameters,
    optionalPositionals,
    requiredParameters,
    requiredPositionals,
  } = collateArguments(parameters);
  let example = `${process.argv[1]}`;
  if (requiredPositionals.length) {
    example += requiredPositionals.map(p => ` <${p.long!}>`).join('');
  }
  if (requiredParameters.length) {
    example += requiredParameters
      .map(
        p =>
          ` ${p.short ? '-' + p.short : '--' + p.long!}${p.type !== 'boolean' ? ' <' + p.long! + '>' : ''}`,
      )
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
  const example = buildExample(sc.parameters);
  if (warning) {
    console.log(`${warning}\n`);
  }
  console.log(`${sc.description}\n`);
  console.log(`Usage: ${example}\n`);
  console.log('Options:', sc.parameters);
};

const buildParseArgsConfigObject = (parameters: {
  [key: string]: ScriptParameter;
}): ParseArgsConfig => {
  const options = {
    help: {
      default: false,
      short: 'h',
      type: 'boolean',
    },
    verbose: {
      default: false,
      short: 'v',
      type: 'boolean',
    },
  } as const;
  const argConfig = {
    allowPositionals: false,
    options,
    strict: true,
  };
  for (const varName in parameters) {
    const paramConfig = parameters[varName];
    const { multiple, short, type } = paramConfig;
    const defaultValue = type === 'boolean' ? false : paramConfig.default;
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
  // to facilitate testing we'll explicitly set them in the config object
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
  if (typeof value === 'string') {
    value = [value];
  }
  if (typeof value === 'number') {
    value = [`${value}`];
  }
  for (const aVal of value) {
    if (typeof aVal === 'string') {
      if (commaDelimited) {
        strings.push(...aVal.split(','));
      } else {
        strings.push(aVal);
      }
    } else if (typeof aVal === 'number') {
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
  const showErrorAndExit = (errorMessage: string): void => {
    if (verbose) {
      console.log(errorMessage);
    } else {
      usage(sc, errorMessage);
    }
    process.exit(1);
  };
  const { optionalPositionals, requiredParameters, requiredPositionals } =
    collateArguments(sc.parameters);
  if (optionalPositionals.length && requiredParameters.length) {
    showErrorAndExit(
      'invalid parameters: optional positionals are not compatible with required parameters',
    );
  }
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
        'invalid positionals: positions must be sequential starting at 0',
      );
    }
  }
  for (const requiredParam of [...requiredPositionals, ...requiredParameters]) {
    const longName = requiredParam.long!;
    if (!(longName in parsedValues) || !parsedValues[longName]) {
      showErrorAndExit(`invalid input: expected ${longName}`);
    }
  }
};

export const parseArguments = (
  sc: ScriptConfig,
): { [k: string]: string | string[] | boolean | number | number[] } => {
  sc.parameters.verbose = { default: false, short: 'v', type: 'boolean' };
  const config = buildParseArgsConfigObject(sc.parameters);
  const { positionals, values } = rawParseArgs(config, sc);
  showHelpAndVerbose(sc, positionals, values);
  const parsedParameters = parseAndTransformValues(sc, positionals, values);
  if (parsedParameters.verbose) {
    console.log('parsed arguments:', parsedParameters);
  }
  validateParsedValues(sc, parsedParameters, !!parsedParameters.verbose);
  return parsedParameters;
};
