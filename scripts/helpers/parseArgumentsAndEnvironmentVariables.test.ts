import {
  type ScriptConfig,
  parseArguments,
  parseIntRange,
  parseInts,
  parseIntsArg,
} from './parseArguments';
import { cloneDeep } from 'lodash';

const mockScriptConfig: ScriptConfig = {
  description: 'some script',
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
};

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
    let ints = parseInts('1,2,3');
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

describe('parseArguments', () => {
  const originalArgv = cloneDeep(process.argv);
  const mockEventCode = 'noa';
  beforeEach(() => {
    process.argv = ['ts-node', 'some-script.ts', mockEventCode];
  });
  afterAll(() => {
    process.argv = originalArgv;
  });
  describe('--help flag', () => {
    it('prints help output and exits before validating parameters', () => {
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      try {
        parseArguments(mockScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenCalledTimes(3);
      expect(mockExit).toHaveBeenCalledWith(0);
    });
    it('generates a usage example from provided configuration', () => {
      process.argv = ['ts-node', 'some-script.ts', '-h'];
      try {
        parseArguments(mockScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        2,
        'Usage: some-script.ts <eventCode> [ -f -y <year> -v ]\n',
      );
    });
  });
  describe('--verbose flag', () => {
    it('prints verbose output after validating parameters and does not exit', () => {
      process.argv.push('-v');
      const { eventCode, verbose } = parseArguments(mockScriptConfig);
      expect(eventCode).toEqual(mockEventCode); // parameters are parsed
      expect(verbose).toBeTruthy();
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'Verbose output enabled\n',
      );
      expect(mockConsoleLog).toHaveBeenCalledTimes(7);
      expect(mockExit).not.toHaveBeenCalled();
    });
  });
  describe('parameter validation', () => {
    it('does not allow a boolean parameter to be defaulted to true', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters.fiscal.required = true;
      const { fiscal } = parseArguments(itsScriptConfig);
      expect(fiscal).toBeFalsy();
      expect(mockExit).not.toHaveBeenCalled();
    });
    it('positionals that precede a required positional will also be required', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters.eventCode.required = false;
      itsScriptConfig.parameters.judge = {
        position: 1,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters.status = {
        position: 2,
        required: true,
        type: 'string',
      };
      try {
        parseArguments(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'invalid input: expected judge\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('does not allow positionals that are not sequential', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters.fiscal = {
        position: 1,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters.year = {
        position: 2,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters.judge = {
        position: 5,
        required: false,
        type: 'string',
      };
      try {
        parseArguments(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'invalid positionals: positions must be sequential starting at 0\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('does not allow positionals that do not start at 0', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters.eventCode.position = 20;
      itsScriptConfig.parameters.fiscal = {
        position: 21,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters.year = {
        position: 22,
        required: false,
        type: 'string',
      };
      itsScriptConfig.parameters.judge = {
        position: 23,
        required: false,
        type: 'string',
      };
      try {
        parseArguments(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'invalid positionals: positions must be sequential starting at 0\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('exits if required positionals were not provided', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters.judge = {
        position: 1,
        required: true,
        type: 'string',
      };
      try {
        parseArguments(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'invalid input: expected judge\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
    it('exits if required parameters were not provided', () => {
      const itsScriptConfig = cloneDeep(mockScriptConfig);
      itsScriptConfig.parameters.judge = {
        required: true,
        short: 'j',
        type: 'string',
      };
      try {
        parseArguments(itsScriptConfig);
      } catch (err: any) {
        expect(err.toString()).toEqual('Error: caught process.exit');
      }
      expect(mockConsoleLog).toHaveBeenNthCalledWith(
        1,
        'invalid input: expected judge\n',
      );
      expect(mockExit).toHaveBeenCalledWith(1);
    });
  });
  describe('value transformation', () => {
    describe('number', () => {
      it('transforms a string into a number', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters.year.default = '2024';
        itsScriptConfig.parameters.year.multiple = false;
        process.argv.push(...['-y', '2018']);
        const { year } = parseArguments(itsScriptConfig);
        expect(year).toEqual(2018);
      });
      it('transforms an array of strings into an array of numbers', () => {
        process.argv.push(...['-y', '2020', '-y', '2024']);
        const { year } = parseArguments(mockScriptConfig);
        expect(year).toEqual([2020, 2024]);
      });
      it(
        'transforms a string containing comma-delimited integers and integer ' +
          'ranges into a sorted array of unique integers',
        () => {
          process.argv.push(...['-y', '8,12,3-5,1,7-9']);
          const { year } = parseArguments(mockScriptConfig);
          expect(year).toEqual([1, 3, 4, 5, 7, 8, 9, 12]);
        },
      );
    });
    describe('toLowerCase', () => {
      it('transforms a string to lower case', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters.eventCode.transform = 'toLowerCase';
        process.argv = ['ts-node', 'some-script.ts', 'FEEW'];
        const { eventCode } = parseArguments(itsScriptConfig);
        expect(eventCode).toEqual('feew');
      });
    });
    describe('toUpperCase', () => {
      it('transforms a string to upper case', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters.eventCode.transform = 'toUpperCase';
        const { eventCode } = parseArguments(itsScriptConfig);
        expect(eventCode).toEqual('NOA');
      });
      it('transforms a comma-delimited string into an array of upper case strings', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters.eventCode.commaDelimited = true;
        itsScriptConfig.parameters.eventCode.transform = 'toUpperCase';
        process.argv = ['ts-node', 'some-script.ts', 'm071,m074'];
        const { eventCode } = parseArguments(itsScriptConfig);
        expect(eventCode).toEqual(['M071', 'M074']);
      });
    });
  });
  describe('ScriptParameter properties', () => {
    describe('commaDelimited', () => {
      it('splits a comma-delimited string into an array of strings', () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters.eventCode.commaDelimited = true;
        process.argv = ['ts-node', 'some-script.ts', 'M071,M074,FEEW'];
        const { eventCode } = parseArguments(itsScriptConfig);
        expect(eventCode).toEqual(['M071', 'M074', 'FEEW']);
      });
    });
    describe('long', () => {
      it("allows a parameter's long form to differ from its resulting parsed key", () => {
        const itsScriptConfig = cloneDeep(mockScriptConfig);
        itsScriptConfig.parameters.eventCode = {
          long: 'event-code',
          short: 'c',
          type: 'string',
        };
        process.argv = ['ts-node', 'some-script.ts', '--event-code', 'NOA'];
        const { eventCode } = parseArguments(itsScriptConfig);
        expect(eventCode).toEqual('NOA');
      });
    });
    describe('multiple', () => {
      it(
        'compiles a single flat array containing all members when multiple ' +
          'sets of comma-delimited values are provided',
        () => {
          const itsScriptConfig = cloneDeep(mockScriptConfig);
          itsScriptConfig.parameters.eventCode = {
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
          const { eventCode } = parseArguments(itsScriptConfig);
          expect(eventCode).toEqual(['M01', 'M02', 'M042', 'M071', 'M074']);
        },
      );
      it(
        'compiles a single flat array containing all members when multiple ' +
          'sets of integer ranges are provided',
        () => {
          process.argv.push(...['-y', '2018,2020', '-y', '2022-2024']);
          const { year } = parseArguments(mockScriptConfig);
          expect(year).toEqual([2018, 2020, 2022, 2023, 2024]);
        },
      );
    });
  });
});
