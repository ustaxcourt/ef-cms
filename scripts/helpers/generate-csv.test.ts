import { generateCsv } from './generate-csv';
import fs from 'fs';

const exists = jest.spyOn(fs, 'existsSync').mockImplementation(jest.fn());
const unlink = jest.spyOn(fs, 'unlinkSync').mockImplementation(jest.fn());
const append = jest.spyOn(fs, 'appendFileSync').mockImplementation(jest.fn());

const MOCK_COLUMNS = [
  { header: 'Droid name', key: 'name' },
  { header: 'Droid type', key: 'type' },
  { header: 'Alliance', key: 'alliance' },
];
const MOCK_ROWS = [
  {
    alliance: 'Rebellion',
    name: 'C-3PO',
    restrained: true,
    type: 'Protocol',
  },
  {
    alliance: 'Rebellion',
    name: 'R2-D2',
    restrained: false,
    type: 'Astromech',
  },
  {
    alliance: 'Rebellion',
    name: 'C1-10P',
    restrained: false,
    type: 'Astromech',
  },
  {
    alliance: 'Empire',
    name: 'IG-88',
    restrained: false,
    type: 'Assassin',
  },
  {
    name: 'MSE-6',
    restrained: true,
    type: 'Mouse',
  },
];
const MOCK_FILENAME = `${process.env.HOME}/tmp/jest.csv`;
const MOCK_CONTENTS =
  '"Droid name","Droid type","Alliance"' +
  '\n"C-3PO","Protocol","Rebellion"' +
  '\n"R2-D2","Astromech","Rebellion"' +
  '\n"C1-10P","Astromech","Rebellion"' +
  '\n"IG-88","Assassin","Empire"' +
  '\n"MSE-6","Mouse",""';

describe('generateCsv', () => {
  beforeEach(() => {
    exists.mockReturnValue(true);
  });

  it('deletes the specified output file if it already exists', () => {
    generateCsv({
      columns: MOCK_COLUMNS,
      filename: MOCK_FILENAME,
      rows: MOCK_ROWS,
    });

    expect(unlink).toHaveBeenCalled();
    expect(append).toHaveBeenCalled();
  });

  it('does not attempt to delete the specified output file if it does not already exist', () => {
    exists.mockReturnValueOnce(false);

    generateCsv({
      columns: MOCK_COLUMNS,
      filename: MOCK_FILENAME,
      rows: MOCK_ROWS,
    });

    expect(unlink).not.toHaveBeenCalled();
    expect(append).toHaveBeenCalled();
  });

  it('compiles an array of objects into a CSV with the given columns', () => {
    generateCsv({
      columns: MOCK_COLUMNS,
      filename: MOCK_FILENAME,
      rows: MOCK_ROWS,
    });

    expect(append).toHaveBeenCalledWith(MOCK_FILENAME, MOCK_CONTENTS);
  });
});
