import { find } from 'lodash';
import { formattedTrialSessions as formattedTrialSessionsComputed } from '../../src/presenter/computeds/formattedTrialSessions';
import { runCompute } from 'cerebral/test';
import { trialCitiesHelper as trialCitiesHelperComputed } from '../../src/presenter/computeds/trialCitiesHelper';
import { withAppContextDecorator } from '../../src/withAppContext';

const formattedTrialSessions = withAppContextDecorator(
  formattedTrialSessionsComputed,
);

export const docketClerkViewsTrialSessionList = cerebralTest => {
  return it('Docket clerk views trial session list', async () => {
    await cerebralTest.runSequence('gotoTrialSessionsSequence');
    expect(cerebralTest.getState('currentPage')).toEqual('TrialSessions');

    const result = await runCompute(
      withAppContextDecorator(trialCitiesHelperComputed),
    );

    const { trialCitiesByState } = result();

    // disable eslint to keep order of keys
    /* eslint-disable */
    const formattedCitiesWithStandaloneOption = {
      'Standalone Remote': ['Standalone Remote'],
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
      JSON.stringify(formattedCitiesWithStandaloneOption),
    );

    const formatted = runCompute(formattedTrialSessions, {
      state: cerebralTest.getState(),
    });
    expect(formatted.formattedSessions.length).toBeGreaterThan(0);

    const trialSession = find(formatted.sessionsByTerm, {
      trialSessionId: cerebralTest.lastCreatedTrialSessionId,
    });

    expect(trialSession).toBeDefined();

    cerebralTest.trialSessionId = trialSession && trialSession.trialSessionId;
    if (cerebralTest.createdTrialSessions) {
      cerebralTest.createdTrialSessions.push(cerebralTest.trialSessionId);
    }
  });
};
