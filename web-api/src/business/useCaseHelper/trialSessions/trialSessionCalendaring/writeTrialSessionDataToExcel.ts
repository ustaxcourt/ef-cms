import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { ScheduledTrialSession } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import ExcelJS from 'exceljs';

export const writeTrialSessionDataToExcel = async ({
  scheduledTrialSessions,
  sessionCountPerWeek,
  weeks,
}: {
  scheduledTrialSessions: ScheduledTrialSession[];
  weeks: string[];
  sessionCountPerWeek: Record<string, number>;
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheetOptions = { properties: { outlineLevelCol: 2 } };
  const worksheet = workbook.addWorksheet('sheetInProgress', worksheetOptions);

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
          if (cell.value) {
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
  worksheet.addRow({ city: 'No. of Sessions', ...sessionCountPerWeek });

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
