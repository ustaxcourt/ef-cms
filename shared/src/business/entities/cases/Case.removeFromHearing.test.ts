const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { MOCK_CASE } = require('../../../test/mockCase');
const { TrialSession } = require('../trialSessions/TrialSession');

describe('removeFromHearing', () => {
  it('removes the hearing from the case', () => {
    const trialSessionHearing = new TrialSession(
      {
        isCalendared: true,
        judge: { name: 'Judge Buch' },
        maxCases: 100,
        sessionType: 'Regular',
        startDate: '2025-03-01T00:00:00.000Z',
        term: 'Fall',
        termYear: '2025',
        trialLocation: 'Birmingham, Alabama',
      },
      { applicationContext },
    );
    const caseToUpdate = new Case(
      {
        ...MOCK_CASE,
        hearings: [trialSessionHearing],
      },
      {
        applicationContext,
      },
    );
    caseToUpdate.removeFromHearing(trialSessionHearing.trialSessionId);

    expect(caseToUpdate.hearings).toEqual([]);
  });
});
