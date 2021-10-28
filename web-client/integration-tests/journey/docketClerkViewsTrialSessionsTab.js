import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { trialCitiesHelper as trialCitiesHelperComputed } from '../../src/presenter/computeds/trialCitiesHelper';
import { trialSessionsHelper as trialSessionsHelperComputed } from '../../src/presenter/computeds/trialSessionsHelper';

import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export const docketClerkViewsTrialSessionsTab = (
  cerebralTest,
  overrides = {},
) => {
  const status = overrides.tab || 'Open';
  return it(`Docket clerk views ${status} Trial Sessions tab`, async () => {
    await cerebralTest.runSequence('gotoTrialSessionsSequence', {
      query: {
        status,
      },
    });

    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');
    expect(
      cerebralTest.getState('screenMetadata.trialSessionFilters.status'),
    ).toEqual(status);

    const result = await runCompute(
      withAppContextDecorator(trialCitiesHelperComputed),
    );

    const { trialCitiesByState } = result();

    /* eslint-disable */
    const formattedCitiesWithStandalonOption = {
      Alabama: ['Birmingham, Alabama', 'Mobile, Alabama'],
      Alaska: ['Anchorage, Alaska'],
      Arizona: ['Phoenix, Arizona'],
      Arkansas: ['Little Rock, Arkansas'],
      California: [
        'Los Angeles, California',
        'San Diego, California',
        'San Francisco, California',
      ],
      Colorado: ['Denver, Colorado'],
      Connecticut: ['Hartford, Connecticut'],
      'District of Columbia': ['Washington, District of Columbia'],
      Florida: ['Jacksonville, Florida', 'Miami, Florida', 'Tampa, Florida'],
      Georgia: ['Atlanta, Georgia'],
      'Standalone Remote': ['Standalone Remote'],
      Hawaii: ['Honolulu, Hawaii'],
      Idaho: ['Boise, Idaho'],
      Illinois: ['Chicago, Illinois'],
      Indiana: ['Indianapolis, Indiana'],
      Iowa: ['Des Moines, Iowa'],
      Kentucky: ['Louisville, Kentucky'],
      Louisiana: ['New Orleans, Louisiana'],
      Maryland: ['Baltimore, Maryland'],
      Massachusetts: ['Boston, Massachusetts'],
      Michigan: ['Detroit, Michigan'],
      Minnesota: ['St. Paul, Minnesota'],
      Mississippi: ['Jackson, Mississippi'],
      Missouri: ['Kansas City, Missouri', 'St. Louis, Missouri'],
      Montana: ['Helena, Montana'],
      Nebraska: ['Omaha, Nebraska'],
      Nevada: ['Las Vegas, Nevada', 'Reno, Nevada'],
      'New Mexico': ['Albuquerque, New Mexico'],
      'New York': ['Buffalo, New York', 'New York City, New York'],
      'North Carolina': ['Winston-Salem, North Carolina'],
      Ohio: ['Cincinnati, Ohio', 'Cleveland, Ohio', 'Columbus, Ohio'],
      Oklahoma: ['Oklahoma City, Oklahoma'],
      Oregon: ['Portland, Oregon'],
      Pennsylvania: ['Philadelphia, Pennsylvania', 'Pittsburgh, Pennsylvania'],
      'South Carolina': ['Columbia, South Carolina'],
      Tennessee: [
        'Knoxville, Tennessee',
        'Memphis, Tennessee',
        'Nashville, Tennessee',
      ],
      Texas: [
        'Dallas, Texas',
        'El Paso, Texas',
        'Houston, Texas',
        'Lubbock, Texas',
        'San Antonio, Texas',
      ],
      Utah: ['Salt Lake City, Utah'],
      Virginia: ['Richmond, Virginia'],
      Washington: ['Seattle, Washington', 'Spokane, Washington'],
      'West Virginia': ['Charleston, West Virginia'],
      Wisconsin: ['Milwaukee, Wisconsin'],
    };
    /* eslint-enable */

    expect(JSON.stringify(trialCitiesByState)).toEqual(
      JSON.stringify(formattedCitiesWithStandalonOption),
    );

    const formatted = runCompute(formattedTrialSessions, {
      state: cerebralTest.getState(),
    });

    const trialSessionsHelper = withAppContextDecorator(
      trialSessionsHelperComputed,
    );

    const helper = runCompute(trialSessionsHelper, {
      state: cerebralTest.getState(),
    });

    const legacyJudge = helper.trialSessionJudges.find(
      judge => judge.role === 'legacyJudge',
    );

    if (status === 'Closed' || status === 'All') {
      expect(legacyJudge).toBeTruthy();
    } else {
      expect(legacyJudge).toBeFalsy();
    }

    const filteredSessions = formatted.filteredTrialSessions[status];

    let foundSession;
    filteredSessions.some(trialSession => {
      trialSession.sessions.some(session => {
        if (session.trialSessionId === cerebralTest.trialSessionId) {
          foundSession = session;
          return true;
        }
      });
      if (foundSession) {
        return true;
      }
    });

    expect(foundSession).toBeTruthy();
  });
};
