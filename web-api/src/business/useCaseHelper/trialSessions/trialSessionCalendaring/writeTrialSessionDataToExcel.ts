import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { ScheduledTrialSession } from '@web-api/business/useCaseHelper/trialSessions/trialSessionCalendaring/assignSessionsToWeeks';
import ExcelJS from 'excelJs';

export const writeTrialSessionDataToExcel = async ({
  scheduledTrialSessions,
  termName,
}: {
  termName: string;
  scheduledTrialSessions: ScheduledTrialSession[];
}) => {
  const workbook = new ExcelJS.Workbook();
  const worksheetOptions = { properties: { outlineLevelCol: 2 } };
  const worksheet = workbook.addWorksheet(termName, worksheetOptions);

  // {
  // 'someCity: {location: 'someCity', 02/23: 'hybrid'},
  // }
  const sessionsByCity = scheduledTrialSessions.reduce((acc, session) => {
    if (!acc[session.city!]) {
      acc[session.city!] = {};
    }
    acc[session.city!][session.weekOf!] = session.sessionType;
    return acc;
  }, {});

  // Get list of unique weeks
  const weeks = new Set<string>();
  scheduledTrialSessions.forEach(session => {
    weeks.add(session.weekOf);
  });

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
    const row = worksheet.addRow(values);

    row.eachCell({ includeEmpty: true }, cell => {
      // cell.border = {
      //   bottom: { style: 'thin' },
      //   left: { style: 'thin' },
      //   right: { style: 'thin' },
      //   top: { style: 'thin' },
      // };

      switch (cell.value) {
        case SESSION_TYPES.hybrid:
          cell.fill = {
            fgColor: { argb: 'FFFFA500' },
            pattern: 'solid',
            type: 'pattern', // Orange
          };
          break;
        case SESSION_TYPES.small:
          cell.fill = {
            fgColor: { argb: 'FF008000' },
            pattern: 'solid',
            type: 'pattern', // Green
          };
          break;
        case SESSION_TYPES.regular:
          cell.fill = {
            fgColor: { argb: 'FFFFFF00' },
            pattern: 'solid',
            type: 'pattern', // Yellow
          };
          break;
        case SESSION_TYPES.special:
          cell.fill = {
            fgColor: { argb: 'FF9d00ff' },
            pattern: 'solid',
            type: 'pattern', // Purple?
          };
          break;
        default:
          break;
      }
    });
  }
  worksheet.insertRow(1, [null, 'Week Of']);

  // term name takes more input
  await workbook.xlsx.writeFile(`${termName}.xlsx`);
};
