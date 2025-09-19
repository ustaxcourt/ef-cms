import { CaseCountsAndSessionsByCity } from './getDataForCalendaring';
import { writeTrialSessionDataToExcel } from './writeTrialSessionDataToExcel';
import ExcelJS from 'exceljs';
import mockCaseCountsAndSessionsByCity from '@shared/test/mockCaseCountsAndSessionsByCity.json';
import mockIncorrectSizeRegularCases from '@shared/test/mockIncorrectlySizedCases.json';
import path from 'path';
import { IsoDateRange } from '@shared/business/utilities/DateHandler';

const mockUserMessages = [
  'More than two special trial sessions per week: Washington, District of Columbia 2/10. \n',
  'More than one special trial per week scheduled: Atlanta, Georgia, 3/3. \n',
  'More special sessions than maximum allowed per location scheduled: Atlanta, Georgia. \n',
];

const mockWeeks: {
  ranges: IsoDateRange[];
  termEndDate: string;
  termStartDate: string;
} = {
  termEndDate: '2025-04-04',
  termStartDate: '2024-12-30',
  ranges: [
    { start: '2024-12-30', end: '2025-01-03' },
    { start: '2025-01-06', end: '2025-01-10' },
    { start: '2025-01-13', end: '2025-01-17' },
    { start: '2025-01-20', end: '2025-01-24' },
    { start: '2025-01-27', end: '2025-01-31' },
    { start: '2025-02-03', end: '2025-02-07' },
    { start: '2025-02-10', end: '2025-02-14' },
    { start: '2025-02-17', end: '2025-02-21' },
    { start: '2025-02-24', end: '2025-02-28' },
    { start: '2025-03-03', end: '2025-03-07' },
    { start: '2025-03-10', end: '2025-03-14' },
    { start: '2025-03-17', end: '2025-03-21' },
    { start: '2025-03-24', end: '2025-03-28' },
    { start: '2025-03-31', end: '2025-04-04' },
  ],
};

describe('writeTrialSessionDataToExcel', () => {
  it('generates an XLSX file that matches the expected fixture', async () => {
    // Arrange
    const filename = path.join(
      process.cwd(),
      'shared/src/test/mockTermSpreadsheet.xlsx',
    );

    const expectedWorkbook = new ExcelJS.Workbook();
    await expectedWorkbook.xlsx.readFile(filename);
    const expectedSuggestedSessionCalendarWorksheet =
      expectedWorkbook.getWorksheet('Suggested Session Calendar');
    const expectedIncorrectlySizedCases = expectedWorkbook.getWorksheet(
      'Incorrectly Sized Cases',
    );
    const expectedWarnings = expectedWorkbook.getWorksheet('Warnings');

    // Act
    const buffer = await writeTrialSessionDataToExcel({
      caseCountsAndSessionsByCity:
        mockCaseCountsAndSessionsByCity as CaseCountsAndSessionsByCity,
      incorrectSizeRegularCases: mockIncorrectSizeRegularCases,
      userMessages: mockUserMessages,
      weeksRange: mockWeeks,
    });

    const actualWorkbook = new ExcelJS.Workbook();
    await actualWorkbook.xlsx.load(buffer);
    const actualSuggestedSessionCalendarWorksheet = actualWorkbook.getWorksheet(
      'Suggested Session Calendar',
    );
    const actualIncorrectlySizedCases = actualWorkbook.getWorksheet(
      'Incorrectly Sized Cases',
    );
    const actualWarnings = actualWorkbook.getWorksheet('Warnings');

    // Assert
    compareWorksheets(
      actualSuggestedSessionCalendarWorksheet!,
      expectedSuggestedSessionCalendarWorksheet!,
    );

    compareWorksheets(
      actualIncorrectlySizedCases!,
      expectedIncorrectlySizedCases!,
    );

    compareWorksheets(actualWarnings!, expectedWarnings!);
  });

  it('generates an XLSX file with only one worksheet when no warnings or incorrectly sized cases are passed', async () => {
    // Arrange
    const caseCountsAndSessionsByCity = {
      cityA: {
        initialRegularCases: 0,
        initialSmallCases: 0,
        prospectiveSessions: [],
        remainingRegularCases: 0,
        remainingSmallCases: 0,
        scheduledSessions: [],
      },
    } as CaseCountsAndSessionsByCity;
    const incorrectSizeRegularCases = [];
    const userMessages = [];
    const weeksRange: {
      ranges: IsoDateRange[];
      termEndDate: string;
      termStartDate: string;
    } = {
      termStartDate: '2025-01-01',
      termEndDate: '2025-01-05',
      ranges: [{ start: '2025-01-01', end: '2025-01-05' }],
    };

    // Act
    const buffer = await writeTrialSessionDataToExcel({
      caseCountsAndSessionsByCity,
      incorrectSizeRegularCases,
      userMessages,
      weeksRange,
    });

    const actualWorkbook = new ExcelJS.Workbook();
    await actualWorkbook.xlsx.load(buffer);

    const incorrectlySizedCasesWorksheet = actualWorkbook.getWorksheet(
      'Incorrectly Sized Cases',
    );
    const warningsWorksheet = actualWorkbook.getWorksheet('Warnings');

    // Assert
    expect(incorrectlySizedCasesWorksheet).toBeFalsy();
    expect(warningsWorksheet).toBeFalsy();
  });
});

const compareWorksheets = (
  worksheetOne: ExcelJS.Worksheet,
  worksheetTwo: ExcelJS.Worksheet,
) => {
  /**
   * ExcelJS doesn't even instantiate a cell object if not given data to fill
   * the cell. This means, when looping over each cell in a row, if A1 is empty
   * but B1 has data, then row 1 starts with "B1", skipping over A1.
   *
   * Because of this, we first call `eachRow().eachCell()` on the generated worksheet,
   * comparing against the expected worksheet. Then, we swap, looping over the
   * expected worksheet and comparing against the actual worksheet.
   *
   * This ensures that when the actual worksheet contains a cell that the
   * expected worksheet does not, or when the actual worksheet is missing a cell
   * that the expected worksheet has, the test appropriately detects the
   * mismatched cell and will fail.
   */
  compareWorksheetCells(worksheetOne, worksheetTwo);
  compareWorksheetCells(worksheetTwo, worksheetOne);
};

const compareWorksheetCells = (
  worksheetOne: ExcelJS.Worksheet,
  worksheetTwo: ExcelJS.Worksheet,
) => {
  worksheetOne!.eachRow((row, rowIndex) => {
    row.eachCell((cell, colIndex) => {
      const {
        alignment: worksheetOneAlignment,
        border: worksheetOneBorder,
        fill: worksheetOneFill,
        font: worksheetOneFont,
        formula: worksheetOneFormula,
        numFmt: worksheetOneNumFmt,
        text: worksheetOneText,
        value: worksheetOneValue,
      } = cell;

      const {
        alignment: worksheetTwoAlignment,
        border: worksheetTwoBorder,
        fill: worksheetTwoFill,
        font: worksheetTwoFont,
        formula: worksheetTwoFormula,
        numFmt: worksheetTwoNumFmt,
        text: worksheetTwoText,
        value: worksheetTwoValue,
      } = worksheetTwo!.getCell(rowIndex, colIndex);

      expect(worksheetOneText).toEqual(worksheetTwoText);
      expect(worksheetOneValue).toEqual(worksheetTwoValue);
      expect(worksheetOneFill).toEqual(worksheetTwoFill);
      expect(worksheetOneFormula).toEqual(worksheetTwoFormula);
      expect(worksheetOneBorder).toEqual(worksheetTwoBorder);
      expect(worksheetOneFont).toEqual(worksheetTwoFont);
      expect(worksheetOneAlignment).toEqual(worksheetTwoAlignment);
      expect(worksheetOneNumFmt).toEqual(worksheetTwoNumFmt);
    });
  });
};
