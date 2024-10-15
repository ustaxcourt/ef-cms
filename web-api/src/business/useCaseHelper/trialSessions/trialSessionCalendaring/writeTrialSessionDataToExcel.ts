import { CaseCountByCity } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/getDataForCalendaring';
import {
  FORMATS,
  formatDateString,
} from '@shared/business/utilities/DateHandler';
import {
  RemainingCaseCountByCity,
  SessionCountByWeek,
  TrialSessionsByCity,
} from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import ExcelJS from 'exceljs';

export const writeTrialSessionDataToExcel = async ({
  initialRegularCaseCountsByCity,
  initialSmallCaseCountsByCity,
  remainingRegularCaseCountByCity,
  remainingSmallCaseCountByCity,
  sessionCountPerWeek,
  sortedScheduledTrialSessionsByCity,
  weeks,
}: {
  sortedScheduledTrialSessionsByCity: TrialSessionsByCity;
  weeks: string[];
  sessionCountPerWeek: SessionCountByWeek;
  initialRegularCaseCountsByCity: CaseCountByCity;
  initialSmallCaseCountsByCity: CaseCountByCity;
  remainingRegularCaseCountByCity: RemainingCaseCountByCity;
  remainingSmallCaseCountByCity: RemainingCaseCountByCity;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheetOptions = { properties: { outlineLevelCol: 2 } };
  const worksheet = workbook.addWorksheet('sheetInProgress', worksheetOptions);

  const trialSessionCalendar = {};
  let allWeekOfSlots = weeks.reduce((acc, weekOfString) => {
    acc[weekOfString] = '';
    return acc;
  }, {});

  for (const city in sortedScheduledTrialSessionsByCity) {
    const weekOfsForCity = sortedScheduledTrialSessionsByCity[city].reduce(
      (acc, session) => {
        acc[session.weekOf] = session.sessionType;
        return acc;
      },
      { ...allWeekOfSlots },
    );

    trialSessionCalendar[city] = weekOfsForCity;
  }

  let columns: any[] = [
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

  worksheet.columns = columns;

  for (const cityStateString in trialSessionCalendar) {
    let city;
    if (!cityStateString.toLowerCase().startsWith('portland')) {
      city = cityStateString.split(',')[0];
    } else {
      city = cityStateString;
    }
    const values = {
      city,
      ...trialSessionCalendar[cityStateString],
      initialRegularCaseCount:
        initialRegularCaseCountsByCity[cityStateString] || 0,
      initialSmallCaseCount: initialSmallCaseCountsByCity[cityStateString] || 0,
      remainingRegularCaseCount:
        remainingRegularCaseCountByCity[cityStateString] || 0,
      remainingSmallCaseCount:
        remainingSmallCaseCountByCity[cityStateString] || 0,
    };
    worksheet.addRow(values);
  }

  worksheet.eachRow(row => {
    row.eachCell({ includeEmpty: true }, cell => {
      cell.border = {
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
        top: { style: 'thin' },
      };

      switch (cell.value) {
        case SESSION_TYPES.hybrid:
          cell.fill = {
            fgColor: { argb: 'ffFDB8AE' },
            pattern: 'solid',
            type: 'pattern',
          };
          break;
        case SESSION_TYPES.small:
          cell.fill = {
            fgColor: { argb: 'ff97D4EA' },
            pattern: 'solid',
            type: 'pattern',
          };
          break;
        case SESSION_TYPES.regular:
          cell.fill = {
            fgColor: { argb: 'ffb4d0b9' },
            pattern: 'solid',
            type: 'pattern',
          };
          break;
        case SESSION_TYPES.special:
          cell.fill = {
            fgColor: { argb: 'ffD0C3E9' },
            pattern: 'solid',
            type: 'pattern',
          };
          break;
        default:
          if (cell.value && typeof cell.value === 'string') {
            cell.fill = {
              fgColor: { argb: 'ff989ca3' },
              pattern: 'solid',
              type: 'pattern',
            };
          }
          break;
      }
    });
  });

  worksheet.insertRow(1, [null, 'Week Of']);

  const counterRow = worksheet.addRow({
    city: 'No. of Sessions',
    ...sessionCountPerWeek,
  });

  const countColumnLength = Object.keys(trialSessionCalendar).length; // number of cells in a column that we care about

  counterRow.eachCell(cell => {
    cell.border = {
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' },
      top: { style: 'thin' },
    };

    const cellLetter = cell.$col$row.split('$')[1];
    if (cellLetter === 'A') return;
    const formula = `counta(${cellLetter}3:${cellLetter}${countColumnLength + 2})`;
    cell.value = {
      formula,
      result: 0,
    };
  });

  const cityTitleCell = worksheet.getCell('A2');

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
