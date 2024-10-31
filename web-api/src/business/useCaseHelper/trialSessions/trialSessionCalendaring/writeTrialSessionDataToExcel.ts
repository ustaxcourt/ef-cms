import { CaseCountsAndSessionsByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { SessionCountByWeek } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import ExcelJS from 'exceljs';

type ColumnObject = { header: string; key: string };

const CITY_TITLE_CELL_LOCATION = 'A2';

export const writeTrialSessionDataToExcel = async ({
  caseCountsAndSessionsByCity,
  sessionCountPerWeek,
  weeks,
}: {
  weeks: string[];
  sessionCountPerWeek: SessionCountByWeek;
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheetOptions = { properties: { outlineLevelCol: 2 } };
  const worksheet = workbook.addWorksheet('sheetInProgress', worksheetOptions);

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
      const { border, fill } = getSessionCellData(cell.value);
      cell.border = border;
      cell.fill = fill;
    });
  });

  worksheet.insertRow(1, [null, 'Week Of']);

  const counterRow = worksheet.addRow({
    city: 'No. of Sessions',
    ...sessionCountPerWeek,
  });

  const countColumnLength = Object.keys(rowsByCity).length; // number of cells in a column that we care about

  counterRow.eachCell(cell => {
    const cellLetter = cell.$col$row.split('$')[1];
    const { border, value } = getCounterCellData(cellLetter, countColumnLength);

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

  return (await workbook.xlsx.writeBuffer()) as unknown as Buffer;
};

const getRowsByCity = ({
  caseCountsAndSessionsByCity,
  weeks,
}: {
  caseCountsAndSessionsByCity: CaseCountsAndSessionsByCity;
  weeks: string[];
}): Record<string, object> => {
  let rowsByCity = {};
  let allWeekOfSlots = weeks.reduce((acc, weekOfString) => {
    acc[weekOfString] = '';
    return acc;
  }, {});

  for (const city in caseCountsAndSessionsByCity) {
    const cityRow = caseCountsAndSessionsByCity[city].scheduledSessions.reduce(
      (acc, session) => {
        acc[session.weekOf] = session.sessionType;
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
    },
  ];

  for (const week of weeks) {
    columns.push({
      header: formatDateString(week, FORMATS.MD),
      key: week,
    });
  }

  columns.push({
    header: 'Small Cases',
    key: 'initialSmallCaseCount',
  });

  columns.push({
    header: 'Regular Cases',
    key: 'initialRegularCaseCount',
  });

  columns.push({
    header: 'Small Cases Remaining',
    key: 'remainingSmallCaseCount',
  });

  columns.push({
    header: 'Regular Cases Remaining',
    key: 'remainingRegularCaseCount',
  });
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
  let city;
  if (!cityStateString.toLowerCase().startsWith('portland')) {
    city = cityStateString.split(',')[0];
  } else {
    city = cityStateString;
  }

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

const getSessionCellData = (
  cellValue,
): { border: object; fill: ExcelJS.Fill } => {
  const border = {
    bottom: { style: 'thin' },
    left: { style: 'thin' },
    right: { style: 'thin' },
    top: { style: 'thin' },
  };
  let fill;
  switch (cellValue) {
    case SESSION_TYPES.hybrid:
      fill = {
        fgColor: { argb: 'ffFDB8AE' },
        pattern: 'solid',
        type: 'pattern',
      };
      break;
    case SESSION_TYPES.small:
      fill = {
        fgColor: { argb: 'ff97D4EA' },
        pattern: 'solid',
        type: 'pattern',
      };
      break;
    case SESSION_TYPES.regular:
      fill = {
        fgColor: { argb: 'ffb4d0b9' },
        pattern: 'solid',
        type: 'pattern',
      };
      break;
    case SESSION_TYPES.special:
      fill = {
        fgColor: { argb: 'ffD0C3E9' },
        pattern: 'solid',
        type: 'pattern',
      };
      break;
    default:
      if (cellValue && typeof cellValue === 'string') {
        fill = {
          fgColor: { argb: 'ff989ca3' },
          pattern: 'solid',
          type: 'pattern',
        };
      }
      break;
  }
  return { border, fill };
};

const getCounterCellData = (
  cellLetter,
  countColumnLength,
): { border: object; value: ExcelJS.CellValue } => {
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
  return { border, value };
};
