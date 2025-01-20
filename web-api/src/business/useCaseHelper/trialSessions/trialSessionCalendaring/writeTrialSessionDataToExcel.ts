import { Case } from '@shared/business/entities/cases/Case';
import {
  CaseCountsAndSessionsByCity,
  EligibleCase,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import ExcelJS from 'exceljs';

type ColumnObject = { header: string; key: string; width?: number };

const CITY_TITLE_CELL_LOCATION = 'A2';

const warningTabRedColor = 'ffb50909';
const specialRedColor = 'ffb50909';
const specialOrangeColor = 'ffffbe2e';
const blackColor = 'ff000000';
const whiteColor = 'ffffffff';
const hybridYellowColor = 'fffee685';
const smallBlueColor = 'ff97D4EA';
const regularGreenColor = 'ffb4d0b9';
const headerGrayColor = 'ffdcdee0';

export const writeTrialSessionDataToExcel = async ({
  caseCountsAndSessionsByCity,
  incorrectSizeRegularCases,
  userMessages,
  weeks,
}: {
  weeks: string[];
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  incorrectSizeRegularCases: EligibleCase[];
  userMessages: string[];
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheetOptions = { properties: { outlineLevelCol: 2 } };
  const worksheet = workbook.addWorksheet(
    'Suggested Session Calendar',
    worksheetOptions,
  );

  const rowsByCity = getRowsByCity({ caseCountsAndSessionsByCity, weeks });

  worksheet.columns = getColumns({ weeks });

  for (const cityStateString in rowsByCity) {
    const populatedRow = populateRow({
      caseCountsAndSessionsByCity,
      cityStateString,
      row: rowsByCity[cityStateString],
    });
    worksheet.addRow(populatedRow);
  }

  worksheet.eachRow(row => {
    row.eachCell({ includeEmpty: true }, cell => {
      const { alignment, border, fill, font } = getCellStyle(cell.value);
      cell.alignment = alignment;
      cell.border = border;
      cell.fill = fill;
      cell.font = font;
    });
  });

  worksheet.insertRow(1, [null, 'Week Of']);

  const emptyCounterRow = weeks.reduce((acc, week) => {
    acc[week] = 0;
    return acc;
  }, {});

  const counterRow = worksheet.addRow({
    city: 'No. of Sessions',
    ...emptyCounterRow,
  });

  const countColumnLength = Object.keys(rowsByCity).length; // number of cells in a column that we care about

  counterRow.eachCell(cell => {
    const cellLetter = cell.$col$row.split('$')[1];
    const { alignment, border, value } = getCounterCellData(
      cellLetter,
      countColumnLength,
    );
    cell.alignment = alignment;
    cell.border = border;
    cell.value = value;
  });

  const cityTitleCell = worksheet.getCell(CITY_TITLE_CELL_LOCATION);

  cityTitleCell.border = {
    bottom: undefined,
    left: undefined,
    right: undefined,
    top: undefined,
  };

  cityTitleCell.fill = {
    pattern: 'none',
    type: 'pattern',
  };

  if (incorrectSizeRegularCases.length > 0) {
    const incorrectlySizedCasesTab = workbook.addWorksheet(
      'Incorrectly Sized Cases',
    );

    incorrectlySizedCasesTab.columns = [
      {
        header: 'City',
        key: 'city',
      },
      { header: 'Docket Numbers' },
    ];

    getIncorrectlySizedCasesRows(incorrectSizeRegularCases).forEach(row => {
      incorrectlySizedCasesTab.addRow(row);
    });
  }

  if (userMessages.length > 0) {
    const warningsTab = workbook.addWorksheet('Warnings', {
      properties: { tabColor: { argb: warningTabRedColor } },
    });

    warningsTab.columns = [
      {
        header: 'Warnings',
        key: 'warning',
        width: 75,
      },
    ];

    userMessages.forEach(message => {
      warningsTab.addRow([message]);
    });
  }
  return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
};

const getRowsByCity = ({
  caseCountsAndSessionsByCity,
  weeks,
}: {
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  weeks: string[];
}): Record<string, object> => {
  const rowsByCity = {};
  const allWeekOfSlots = weeks.reduce((acc, weekOfString) => {
    acc[weekOfString] = '';
    return acc;
  }, {});

  for (const city in caseCountsAndSessionsByCity) {
    const cityRow = caseCountsAndSessionsByCity[city].scheduledSessions.reduce(
      (acc, session) => {
        acc[session.weekOf] = session.ignoresConstraints
          ? 'Special*'
          : session.sessionType;
        return acc;
      },
      { ...allWeekOfSlots },
    );

    rowsByCity[city] = cityRow;
  }
  return rowsByCity;
};

const getColumns = ({ weeks }: { weeks: string[] }): ColumnObject[] => {
  let columns: ColumnObject[] = [
    {
      header: 'City',
      key: 'city',
      width: 17,
    },
  ];

  for (const week of weeks) {
    columns.push({
      header: formatDateString(week, FORMATS.MD),
      key: week,
      width: 8,
    });
  }

  columns = [
    ...columns,
    { header: 'Small Cases', key: 'initialSmallCaseCount', width: 10 },
    {
      header: 'Regular Cases',
      key: 'initialRegularCaseCount',
      width: 12,
    },
    {
      header: 'Small Cases Remaining',
      key: 'remainingSmallCaseCount',
      width: 19,
    },
    {
      header: 'Regular Cases Remaining',
      key: 'remainingRegularCaseCount',
      width: 20,
    },
  ];

  return columns;
};

const populateRow = ({
  caseCountsAndSessionsByCity,
  cityStateString,
  row,
}: {
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  cityStateString: string;
  row: object;
}): {} => {
  const city = formatCityName(cityStateString);

  return {
    city,
    ...row,
    initialRegularCaseCount:
      caseCountsAndSessionsByCity[cityStateString].initialRegularCases,
    initialSmallCaseCount:
      caseCountsAndSessionsByCity[cityStateString].initialSmallCases,
    remainingRegularCaseCount:
      caseCountsAndSessionsByCity[cityStateString].remainingRegularCases,
    remainingSmallCaseCount:
      caseCountsAndSessionsByCity[cityStateString].remainingSmallCases,
  };
};

const getCellStyle = (
  cellValue,
): { border: object; fill: ExcelJS.Fill; font: object; alignment: object } => {
  const border = {
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
  };
  let fill;
  let font = { color: { argb: blackColor } };
  const alignment = { horizontal: 'left', vertical: 'middle' };

  switch (cellValue) {
    case SESSION_TYPES.hybrid:
      fill = {
        fgColor: { argb: hybridYellowColor },
        pattern: 'solid',
        type: 'pattern',
      };
      break;
    case SESSION_TYPES.small:
      fill = {
        fgColor: { argb: smallBlueColor },
        pattern: 'solid',
        type: 'pattern',
      };
      break;
    case SESSION_TYPES.regular:
      fill = {
        fgColor: { argb: regularGreenColor },
        pattern: 'solid',
        type: 'pattern',
      };
      break;
    case SESSION_TYPES.special:
      fill = {
        fgColor: { argb: specialOrangeColor },
        pattern: 'solid',
        type: 'pattern',
      };
      break;
    case 'Special*':
      fill = {
        fgColor: { argb: specialRedColor },
        pattern: 'solid',
        type: 'pattern',
      };
      font = { color: { argb: whiteColor } };
      break;
    default:
      if (cellValue && typeof cellValue === 'string') {
        fill = {
          fgColor: { argb: headerGrayColor },
          pattern: 'solid',
          type: 'pattern',
        };
      }
      break;
  }
  return { alignment, border, fill, font };
};

const getCounterCellData = (
  cellLetter,
  countColumnLength,
): { alignment: object; border: object; value: ExcelJS.CellValue } => {
  const alignment = { horizontal: 'left', vertical: 'middle' };
  const border = {
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
  };
  let value;

  if (cellLetter !== 'A') {
    // Note: The formula below is tailored specifically to Microsoft Excel and
    // Google Sheets; it will not work in Apple Numbers.
    const formula = `SUMPRODUCT(--(LEN(TRIM(${cellLetter}3:${cellLetter}${countColumnLength + 2}))>0))`;
    value = {
      formula,
      result: 0,
    };
  }
  return { alignment, border, value };
};

const formatCityName = (cityString: string): string => {
  let cityName;
  if (!cityString.toLowerCase().startsWith('portland')) {
    cityName = cityString.split(',')[0];
  } else {
    cityName = cityString;
  }

  return cityName;
};

const getIncorrectlySizedCasesRows = (
  incorrectSizeRegularCases: EligibleCase[],
): string[][] => {
  const incorrectlySizedCasesByCity = incorrectSizeRegularCases
    .sort((a, b) => {
      return a.preferredTrialCity!.localeCompare(b.preferredTrialCity!);
    })
    .reduce((acc, theCase) => {
      const docketNumbers = acc[theCase.preferredTrialCity!] || [];
      docketNumbers.push(theCase.docketNumber);
      acc[theCase.preferredTrialCity!] = docketNumbers;
      return acc;
    }, {});

  const rows: string[][] = [];
  for (const location in incorrectlySizedCasesByCity) {
    const city = formatCityName(location);
    rows.push([
      city,
      ...incorrectlySizedCasesByCity[location].sort((a, b) => {
        return (
          Case.getSortableDocketNumber(a)! - Case.getSortableDocketNumber(b)!
        );
      }),
    ]);
  }
  return rows;
};
