/* eslint-disable jest/no-conditional-expect */
import {
  FORMATS,
  formatNow,
  getBusinessDateInFuture,
} from '@shared/business/utilities/DateHandler';
import {
  type ScriptConfig,
  parseArgsAndEnvVars,
  parseIntRange,
  parseInts,
  parseIntsArg,
} from './parseArgsAndEnvVars';
import { cloneDeep } from 'lodash';

const ogScriptConfig: ScriptConfig = {
  description: 'some script',
  environment: {
    env: 'ENV',
  },
  parameters: {
    eventCode: {
      position: 0,
      required: true,
      type: 'string',
    },
    fiscal: {
      default: false,
      short: 'f',
      type: 'boolean',
    },
    year: {
      default: ['2024'],
      multiple: true,
      short: 'y',
      transform: 'number',
      type: 'string',
    },
  },
  requireActiveAwsSession: true,
};
const mockScriptConfig = cloneDeep(ogScriptConfig);

const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {
  // prevent upstream from continuing by throwing an error
  throw new Error('caught process.exit');
});
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('parseIntsRange', () => {
  it('returns array when given valid ranges', () => {
    expect(parseIntRange('1-2')).toEqual([1, 2]);
    expect(parseIntRange('3-1')).toEqual([1, 2, 3]);
    expect(parseIntRange('1-3')).toEqual([1, 2, 3]);
    expect(parseIntRange('0-0')).toEqual([0]); // hoot!
    expect(parseIntRange('')).toEqual([]);
  });

  it('returns single item array when given single number', () => {
    expect(parseIntRange('1')).toEqual([1]);
  });

  it('returns empty array when given no valid input', () => {
    expect(parseIntRange('')).toEqual([]);
  });
});

describe('parseInts', () => {
  it('should return empty array when given empty input', () => {
    expect(parseInts('')).toEqual([]);
  });
  it('should ignore trailing comma', () => {
    expect(parseInts('1,')).toEqual([1]);
  });
  it('should return an array when given comma-delimited list', () => {
    expect(parseInts('1,2,3')).toEqual([1, 2, 3]);
  });
  it('should return an array when given tab-delimited list', () => {
    expect(parseInts('1\t2\t3', '\t')).toEqual([1, 2, 3]);
  });

  it('should return array of ints', () => {
    const ints = parseInts('1,2,3');
    expect(ints).toEqual([1, 2, 3]);
    ints.forEach(n => {
      expect(typeof n).toBe('number');
    });
  });
});

describe('parseIntsArg', () => {
  it('returns empty array when given empty input', () => {
    expect(parseIntsArg('')).toEqual([]);
  });
  it('handles int ranges', () => {
    expect(parseIntsArg('1-3')).toEqual([1, 2, 3]);
  });

  it('handles int lists', () => {
    expect(parseIntsArg('1,2,3')).toEqual([1, 2, 3]);
  });

  it('handles a mix of int lists and ranges', () => {
    expect(parseIntsArg('1,3-5,7-9')).toEqual([1, 3, 4, 5, 7, 8, 9]);
  });
});

describe('parseArgsAndEnvVars', () => {
  const originalArgv = cloneDeep(process.argv);
  const originalEnv = cloneDeep(process.env);
  const mockEventCode = 'noa';
  const mockAwsSessionExpiration = getBusinessDateInFuture({
    numberOfDays: 1,
    outputFormat: FORMATS.ISO,
    startDate: formatNow(FORMATS.ISO),
  });
  beforeEach(() => {
    process.argv = ['ts-node', 'some-script.ts', mockEventCode];
    process.env = {
      AWS_SESSION_EXPIRATION: mockAwsSessionExpiration,
      ENV: 'jest',
    };
  });
  afterAll(() => {
    process.argv = originalArgv;
    process.env = originalEnv;
  });
  describe('--help flag', () => {
    it('prints help output and exits before validating parameters', () => {
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      try {
        parseArgsAndEnvVars(mockScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenCalledTimes(5);
      expect(mockExit).toHaveBeenCalledWith(0);
    });
    it('generates a usage example from provided configuration', () => {
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      try {
        parseArgsAndEnvVars(mockScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        'Usage: some-script.ts <eventCode> [ -f -y <year> -v ]\n',
      );
    });
    it('generates a usage example with required and optional parameters in long and short form', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      delete itsScriptConfig.description;
      delete itsScriptConfig.environment;
      delete itsScriptConfig.parameters!.fiscal.short;
      delete itsScriptConfig.parameters!.year.short;
      itsScriptConfig.parameters!.year.required = true;
      itsScriptConfig.parameters!.judge = {
        required: true,
        short: 'j',
        type: 'string',
      };
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Usage: some-script.ts <eventCode> --year <year> -j <judge> [ --fiscal -v ]\n',
      );
    });
    it('generates a usage example with optional positionals and no optional parameters', () => {
      const itsScriptConfig = cloneDeep(ogScriptConfig);
      delete itsScriptConfig.description;
      delete itsScriptConfig.environment;
      delete itsScriptConfig.parameters!.fiscal;
      delete itsScriptConfig.parameters!.year;
      itsScriptConfig.parameters!.veryCool = {
        position: 1,
        short: 'v', // this tricks it into not adding the verbose param
        type: 'string',
      };
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Usage: some-script.ts <eventCode> [ <veryCool> ]\n',
      );
    });
    it('generates a usage example with no optional parameters', () => {
      const itsScriptConfig = cloneDeep(ogScriptConfig);
      delete itsScriptConfig.description;
      delete itsScriptConfig.environment;
      delete itsScriptConfig.parameters!.fiscal;
      delete itsScriptConfig.parameters!.year;
      itsScriptConfig.parameters!.veryCool = {
        required: true,
        short: 'v',
        type: 'string',
      };
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Usage: some-script.ts <eventCode> -v <veryCool>\n',
      );
    });
    it('does not add the help flag if another flag uses -h', () => {
      const itsScriptConfig = cloneDeep(ogScriptConfig);
      itsScriptConfig.parameters!.hostname = {
        required: true,
        short: 'h',
        type: 'string',
      };
      process.argv.push(...['-h', 'jest']);
      const result = parseArgsAndEnvVars(itsScriptConfig);
      expect(result.hostname).toEqual('jest');
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });
    it('tells the user when an active AWS session is required', () => {
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      try {
        parseArgsAndEnvVars(mockScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        5,
        '\nActive AWS session required.',
      );
    });
    it('does not tell the user an active AWS session is required when it is not required', () => {
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      process.env = { ENV: 'jest' };
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      delete itsScriptConfig.requireActiveAwsSession;
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).not.toHaveBeenCalledWith(
        '\nActive AWS session required.',
      );
    });
  });
  describe('--verbose flag', () => {
    it('prints verbose output after validating parameters and does not exit', () => {
      process.argv.push('-v');
      const { eventCode, verbose } = parseArgsAndEnvVars(mockScriptConfig);
      expect(eventCode).toEqual(mockEventCode); // parameters are parsed
      expect(verbose).toBeTruthy();
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Verbose output enabled\n',
      );
      expect(mockConsoleLog).toHaveBeenCalledTimes(11);
      expect(mockExit).not.toHaveBeenCalled();
    });
    it('only calls usage once if the verbose flag was provided and there was an error', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters!.eventCode.position = 2;
      process.argv.push('-v');
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      const usageCalls = mockConsoleLog.mock.calls.filter(c =>
        c[0].includes('Usage'),
      );
      expect(usageCalls.length).toEqual(1);
    });
    it('does not add the verbose flag if another flag uses -v', () => {
      const itsScriptConfig = cloneDeep(ogScriptConfig);
      itsScriptConfig.parameters!.veryCool = {
        default: false,
        short: 'v',
        type: 'boolean',
      };
      process.argv.push('-v');
      const result = parseArgsAndEnvVars(itsScriptConfig);
      expect(result.veryCool).toBeTruthy();
      const shortArgs = Object.keys(result);
      expect(shortArgs).not.toContain('verbose');
      expect(shortArgs).toContain('veryCool');
    });
    it('prints verbose help output if both the verbose and help flags are set', () => {
      process.argv.push(...['-v', '-h']);
      try {
        parseArgsAndEnvVars(mockScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Verbose output enabled\n',
      );
      expect(mockConsoleLog).toHaveBeenCalledTimes(8);
      expect(mockExit).toHaveBeenCalledWith(0);
    });
  });
  describe('parameter validation', () => {
    it('can be called without any parameters', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      delete itsScriptConfig.parameters;
      process.argv = ['ts-node', 'some-script.ts'];
      parseArgsAndEnvVars(itsScriptConfig);
      expect(mockExit).not.toHaveBeenCalled();
    });
    it('throws if positionals are provided when no positionals are defined', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      delete itsScriptConfig.parameters;
      process.argv.push('anotherPositional');
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockExit).toHaveBeenCalled();
    });
    it('does not allow a boolean parameter to be defaulted to true', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters!.fiscal.required = true;
      const { fiscal } = parseArgsAndEnvVars(itsScriptConfig);
      expect(fiscal).toBeFalsy();
      expect(mockExit).not.toHaveBeenCalled();
    });
    it('positionals that precede a required positional will also be required', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters!.eventCode.required = false;
      itsScriptConfig.parameters!.judge = {
        position: 1,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters!.status = {
        position: 2,
        required: true,
        type: 'string',
      };
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Invalid input: expected judge\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('does not allow positionals that are not sequential', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters!.fiscal = {
        position: 1,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters!.year = {
        position: 2,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters!.judge = {
        position: 5,
        required: false,
        type: 'string',
      };
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Invalid positionals: positions must be sequential starting at 0\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('does not allow positionals that do not start at 0', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters!.eventCode.position = 20;
      itsScriptConfig.parameters!.fiscal = {
        position: 21,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters!.year = {
        position: 22,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters!.judge = {
        position: 23,
        required: false,
        type: 'string',
      };
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Invalid positionals: positions must be sequential starting at 0\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('exits if required positionals were not provided', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters!.judge = {
        position: 1,
        required: true,
        type: 'string',
      };
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Invalid input: expected judge\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('exits if required parameters were not provided', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters!.judge = {
        required: true,
        short: 'j',
        type: 'string',
      };
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Invalid input: expected judge\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
  describe('value transformation', () => {
    describe('number', () => {
      it('transforms a string into a number', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters!.year.default = '2024';
        itsScriptConfig.parameters!.year.multiple = false;
        process.argv.push(...['-y', '2018']);
        const { year } = parseArgsAndEnvVars(itsScriptConfig);
        expect(year).toEqual(2018);
      });
      it('transforms an array of strings into an array of numbers', () => {
        process.argv.push(...['-y', '2020', '-y', '2024']);
        const { year } = parseArgsAndEnvVars(mockScriptConfig);
        expect(year).toEqual([2020, 2024]);
      });
      it(
        'transforms a string containing comma-delimited integers and integer ' +
          'ranges into a sorted array of unique integers',
        () => {
          process.argv.push(...['-y', '8,12,3-5,1,7-9']);
          const { year } = parseArgsAndEnvVars(mockScriptConfig);
          expect(year).toEqual([1, 3, 4, 5, 7, 8, 9, 12]);
        },
      );
    });
    describe('toLowerCase', () => {
      it('transforms a string to lower case', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters!.eventCode.transform = 'toLowerCase';
        process.argv = ['ts-node', 'some-script.ts', 'FEEW'];
        const { eventCode } = parseArgsAndEnvVars(itsScriptConfig);
        expect(eventCode).toEqual('feew');
      });
    });
    describe('toUpperCase', () => {
      it('transforms a string to upper case', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters!.eventCode.transform = 'toUpperCase';
        const { eventCode } = parseArgsAndEnvVars(itsScriptConfig);
        expect(eventCode).toEqual('NOA');
      });
      it('transforms a comma-delimited string into an array of upper case strings', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters!.eventCode.commaDelimited = true;
        itsScriptConfig.parameters!.eventCode.transform = 'toUpperCase';
        process.argv = ['ts-node', 'some-script.ts', 'm071,m074'];
        const { eventCode } = parseArgsAndEnvVars(itsScriptConfig);
        expect(eventCode).toEqual(['M071', 'M074']);
      });
    });
  });
  describe('ScriptParameter properties', () => {
    describe('commaDelimited', () => {
      it('splits a comma-delimited string into an array of strings', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters!.eventCode.commaDelimited = true;
        process.argv = ['ts-node', 'some-script.ts', 'M071,M074,FEEW'];
        const { eventCode } = parseArgsAndEnvVars(itsScriptConfig);
        expect(eventCode).toEqual(['M071', 'M074', 'FEEW']);
      });
    });
    describe('long', () => {
      it("allows a parameter's long form to differ from its resulting parsed key", () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters!.eventCode = {
          long: 'event-code',
          short: 'c',
          type: 'string',
        };
        process.argv = ['ts-node', 'some-script.ts', '--event-code', 'NOA'];
        const { eventCode } = parseArgsAndEnvVars(itsScriptConfig);
        expect(eventCode).toEqual('NOA');
      });
    });
    describe('multiple', () => {
      it(
        'compiles a single flat array containing all members when multiple ' +
          'sets of comma-delimited values are provided',
        () => {
          const itsScriptConfig = cloneDeep(mockScriptConfig);
          itsScriptConfig.parameters!.eventCode = {
            commaDelimited: true,
            long: 'event-code',
            multiple: true,
            short: 'c',
            type: 'string',
          };
          process.argv = [
            'ts-node',
            'some-script.ts',
            '--event-code',
            'M01,M02',
            '--event-code',
            'M042',
            '-c',
            'M071,M074',
          ];
          const { eventCode } = parseArgsAndEnvVars(itsScriptConfig);
          expect(eventCode).toEqual(['M01', 'M02', 'M042', 'M071', 'M074']);
        },
      );
      it(
        'compiles a single flat array containing all members when multiple ' +
          'sets of integer ranges are provided',
        () => {
          process.argv.push(...['-y', '2018,2020', '-y', '2022-2024']);
          const { year } = parseArgsAndEnvVars(mockScriptConfig);
          expect(year).toEqual([2018, 2020, 2022, 2023, 2024]);
        },
      );
    });
  });
  describe('Environment Variables', () => {
    it('exits if a required environment variable is not set', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.environment!.missing = 'MISSINGVAR';
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Missing environment variable: MISSINGVAR\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('exits if multiple required environment variables are not set', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.environment!.missing = 'MISSINGVAR';
      itsScriptConfig.environment!.notSet = 'NOTAREALVAR';
      try {
        parseArgsAndEnvVars(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Missing environment variables: MISSINGVAR, NOTAREALVAR\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('returns the defined environment variables', () => {
      const { env } = parseArgsAndEnvVars(mockScriptConfig);
      expect(env).toEqual('jest');
    });
    it('can be called without any environment variables', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      delete itsScriptConfig.environment;
      parseArgsAndEnvVars(itsScriptConfig);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
  describe('AWS Session Expiration', () => {
    it('exits if the AWS_SESSION_EXPIRATION environment variable is not set', () => {
      process.env = { ENV: 'jest' };
      try {
        parseArgsAndEnvVars(mockScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'AWS session has expired\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('exits if the AWS_SESSION_EXPIRATION value is in the past', () => {
      const awsSessionExpiration = '2020-01-01T00:00:00+00:00';
      process.env.AWS_SESSION_EXPIRATION = awsSessionExpiration;
      try {
        parseArgsAndEnvVars(mockScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        `AWS session expired ${awsSessionExpiration}\n`,
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('does not exit if the AWS_SESSION_EXPIRATION value is in the future', () => {
      parseArgsAndEnvVars(mockScriptConfig);
      expect(mockExit).not.toHaveBeenCalled();
    });
    it('does not exit if the AWS_SESSION_EXPIRATION environment variable is not set and requireActiveAwsSession is false', () => {
      process.env = { ENV: 'jest' };
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      delete itsScriptConfig.requireActiveAwsSession;
      parseArgsAndEnvVars(itsScriptConfig);
      expect(mockExit).not.toHaveBeenCalled();
    });
    it('does not exit if the AWS_SESSION_EXPIRATION environment variable is not set and the CI environment variable is', () => {
      process.env = { CI: 'true', ENV: 'jest' };
      parseArgsAndEnvVars(mockScriptConfig);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
});
