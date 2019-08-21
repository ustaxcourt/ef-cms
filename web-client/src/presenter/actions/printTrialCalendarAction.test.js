import { printTrialCalendarAction } from './printTrialCalendarAction';
import { runAction } from 'cerebral/test';

const MOCK_STATE = {
  formattedCaseDetail: {
    docketNumberWithSuffix: '123-19L',
  },
  formattedTrialSessionDetails: {
    address1: 'No One Knows',
    courthouseName: 'House of the Rising Sun',
    formattedCityStateZip: 'Atlantis, New Orleans',
    formattedCourtReporter: 'Guy Fieri',
    formattedIrsCalendarAdministrator: '',
    formattedJudge: 'Judge Dredd',
    formattedStartDateFull: '11/11/1999',
    formattedStartTime: '3:00 AM',
    formattedTrialClerk: '',
    notes: 'Some notes here.',
    openCases: [],
    sessionType: 'sessionType',
    trialLocation: 'Atlantis',
  },
};

describe('printTrialCalendarAction', () => {
  it('outputs correct HTML for the trial calendar with no cases', async () => {
    const result = await runAction(printTrialCalendarAction, {
      state: MOCK_STATE,
    });

    expect(result.output.contentHtml).toContain('Guy Fieri');
    expect(result.output.contentHtml).toContain('Judge Dredd');
    expect(result.output.contentHtml).toContain('Some notes here.');
  });

  it('outputs correct HTML for trial session calendar with cases', async () => {
    const result = await runAction(printTrialCalendarAction, {
      state: {
        ...MOCK_STATE,
        formattedTrialSessionDetails: {
          ...MOCK_STATE.formattedTrialSessionDetails,
          noLocationEntered: true,
          address1: undefined,
          address2: undefined,
          formattedCityStateZip: undefined,
          notes: undefined,
          openCases: [
            {
              caseCaption: 'Guy Fieri v. Flavortown',
              docketNumberWithSuffix: '123-19L',
              practitioners: [
                { name: 'Bob Seger' },
                { name: 'Jimi Hendrix' },
                { name: 'Bobby Flay' },
              ],
              respondents: [
                { name: 'Johnny Cash' },
                { name: 'Willie Nelson' },
                { name: 'Hank Williams Jr.' },
              ],
            },
          ],
        },
      },
    });

    expect(result.output.contentHtml).toContain('Johnny Cash');
    expect(result.output.contentHtml).toContain('Jimi Hendrix');
  });
});
