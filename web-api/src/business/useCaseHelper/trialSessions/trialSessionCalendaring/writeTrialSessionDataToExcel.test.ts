import { CaseCountsAndSessionsByCity } from './getDataForCalendaring';
import { SESSION_TYPES } from '@shared/business/entities/EntityConstants';
import { writeTrialSessionDataToExcel } from './writeTrialSessionDataToExcel';
import ExcelJS from 'exceljs';

const cityWithSpecialSession = 'Portland, OR';
const cities = [
  'cityA, AB',
  'cityB, AB',
  'cityC, AB',
  'cityD, AB',
  'cityE, AB',
  cityWithSpecialSession,
];
const weeks = ['09/01', '09/08', '09/15', '09/45', '09/89', '09/37'];

describe('writeTrialSessionDataToExcel', () => {
  it('should produce a vaguely valid xlsx file', async () => {
    let mockCaseCountsAndSessionsByCity: CaseCountsAndSessionsByCity = {};
    for (const city of cities) {
      for (const week of weeks) {
        const randomType = Math.floor(Math.random() * 3);
        if (!mockCaseCountsAndSessionsByCity[city]) {
          mockCaseCountsAndSessionsByCity[city] = {
            initialRegularCases: 0,
            initialSmallCases: 0,
            prospectiveSessions: [],
            remainingRegularCases: 0,
            remainingSmallCases: 0,
            scheduledSessions: [],
          };
        }

        const sessionType =
          city === cityWithSpecialSession
            ? SESSION_TYPES.special
            : SESSION_TYPES[Object.keys(SESSION_TYPES)[randomType]];

        mockCaseCountsAndSessionsByCity[city].scheduledSessions.push({
          sessionType,
          trialLocation: city,
          weekOf: week,
        });
      }
    }

    await writeTrialSessionDataToExcel({
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      incorrectSizeRegularCases: [],
      userMessages: [],
      weeks,
    });
  });

  it('should handle data that produces empty cells gracefully', async () => {
    let mockCaseCountsAndSessionsByCity: CaseCountsAndSessionsByCity = {};
    let counter = 1;
    for (const city of cities) {
      for (const week of weeks) {
        counter++;
        if (counter % 4 !== 0) {
          const randomType = Math.floor(Math.random() * 3);
          if (!mockCaseCountsAndSessionsByCity[city]) {
            mockCaseCountsAndSessionsByCity[city] = {
              initialRegularCases: 0,
              initialSmallCases: 0,
              prospectiveSessions: [],
              remainingRegularCases: 0,
              remainingSmallCases: 0,
              scheduledSessions: [],
            };
            mockCaseCountsAndSessionsByCity[city].scheduledSessions = [];
          }
          mockCaseCountsAndSessionsByCity[city].scheduledSessions.push({
            sessionType: SESSION_TYPES[Object.keys(SESSION_TYPES)[randomType]],
            trialLocation: city,
            weekOf: week,
          });
        }
      }
    }

    await writeTrialSessionDataToExcel({
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      incorrectSizeRegularCases: [],
      userMessages: [],
      weeks,
    });
  });

  // 10275 TODO: consider writing tests that open xlsx file, inspects worksheets and so on
  it('tk', async () => {
    // Arrange
    let mockCaseCountsAndSessionsByCity: CaseCountsAndSessionsByCity = {};
    for (const city of cities) {
      for (const week of weeks) {
        const randomType = Math.floor(Math.random() * 3);
        if (!mockCaseCountsAndSessionsByCity[city]) {
          mockCaseCountsAndSessionsByCity[city] = {
            initialRegularCases: 0,
            initialSmallCases: 0,
            prospectiveSessions: [],
            remainingRegularCases: 0,
            remainingSmallCases: 0,
            scheduledSessions: [],
          };
        }

        const sessionType =
          city === cityWithSpecialSession
            ? SESSION_TYPES.special
            : SESSION_TYPES[Object.keys(SESSION_TYPES)[randomType]];

        mockCaseCountsAndSessionsByCity[city].scheduledSessions.push({
          sessionType,
          trialLocation: city,
          weekOf: week,
        });
      }
    }

    // Act
    const buffer = await writeTrialSessionDataToExcel({
      caseCountsAndSessionsByCity: mockCaseCountsAndSessionsByCity,
      incorrectSizeRegularCases: [],
      userMessages: [],
      weeks,
    });

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(buffer);
    const worksheet = workbook.getWorksheet('Suggested Session Calendar');

    // Assert
    expect(worksheet!.getCell('A2').text).toEqual('City');
    // 10275 TODO: possible paths for testing:
    // - programmatically examine the worksheet and assert
    //   that everything looks good.
    // - check an actual xlsx file into the repo and compare
    //   the result of this test against that fixture.
  });
});
