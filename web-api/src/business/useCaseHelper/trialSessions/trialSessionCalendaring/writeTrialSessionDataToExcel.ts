import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { ScheduledTrialSession } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import ExcelJS from 'excelJs';

export const writeTrialSessionDataToExcel = async ({
  scheduledTrialSessions,
  termName,
  weeks,
}: {
  termName: string;
  scheduledTrialSessions: ScheduledTrialSession[];
  weeks: string[];
}) => {
  //
  scheduledTrialSessions = [];

  const cities = ['cityA', 'cityB', 'cityC', 'cityD', 'cityE', 'cityF'];
  weeks = ['09/01', '09/08', '09/15', '09/45', '09/89', '09/37'];
  for (const city of cities) {
    for (const week of weeks) {
      const randomType = Math.floor(Math.random() * 3);
      scheduledTrialSessions.push({
        city,
        sessionType: SESSION_TYPES[Object.keys(SESSION_TYPES)[randomType]],
        weekOf: week,
      });
    }
  }

  //
  const workbook = new ExcelJS.Workbook();
  const worksheetOptions = { properties: { outlineLevelCol: 2 } };
  const worksheet = workbook.addWorksheet(termName, worksheetOptions);

  const sessionsByCity = scheduledTrialSessions.reduce((acc, session) => {
    if (!acc[session.city!]) {
      acc[session.city!] = {};
    }
    acc[session.city!][session.weekOf!] = session.sessionType;
    return acc;
  }, {});

  let columns: { header: string; key: string }[] = [
    {
      header: 'City',
      key: 'city',
    },
  ];

  for (const week of weeks) {
    columns.push({ header: week, key: week });
  }

  worksheet.columns = columns;

  for (const city in sessionsByCity) {
    const values = { city, ...sessionsByCity[city] };
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
            type: 'pattern', // Orange
          };
          break;
        case SESSION_TYPES.small:
          cell.fill = {
            fgColor: { argb: 'ff97D4EA' },
            pattern: 'solid',
            type: 'pattern', // Green
          };
          break;
        case SESSION_TYPES.regular:
          cell.fill = {
            fgColor: { argb: 'ffb4d0b9' },
            pattern: 'solid',
            type: 'pattern', // Yellow
          };
          break;
        case SESSION_TYPES.special:
          cell.fill = {
            fgColor: { argb: 'ffD0C3E9' },
            pattern: 'solid',
            type: 'pattern', // Purple?
          };
          break;
        default:
          if (cell.value) {
            cell.fill = {
              fgColor: { argb: 'ff989ca3' },
              pattern: 'solid',
              type: 'pattern', // grey
            };
          }
          break;
      }
    });
  });

  worksheet.insertRow(1, [null, 'Week Of']);

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

  // term name takes more input
  // await workbook.xlsx.writeFile(`${termName}.xlsx`);
  return await workbook.xlsx.writeBuffer();
};
