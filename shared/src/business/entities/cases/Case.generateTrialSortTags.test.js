const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CASE_TYPES_MAP } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('generateTrialSortTags', () => {
  it('should generate sort tags for a regular case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        receivedAt: '2018-12-12T05:00:00Z',
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateTrialSortTags()).toEqual({
      hybrid: 'WashingtonDistrictofColumbia-H-D-20181212000000-101-18',
      nonHybrid: 'WashingtonDistrictofColumbia-R-D-20181212000000-101-18',
    });
  });

  it('should generate sort tags for a small case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        procedureType: 'Small',
        receivedAt: '2018-12-12T05:00:00Z',
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateTrialSortTags()).toEqual({
      hybrid: 'WashingtonDistrictofColumbia-H-D-20181212000000-101-18',
      nonHybrid: 'WashingtonDistrictofColumbia-S-D-20181212000000-101-18',
    });
  });

  it('should generate sort tags for a prioritized P case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        caseType: CASE_TYPES_MAP.passport,
        receivedAt: '2018-12-12T05:00:00Z',
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateTrialSortTags()).toEqual({
      hybrid: 'WashingtonDistrictofColumbia-H-C-20181212000000-101-18',
      nonHybrid: 'WashingtonDistrictofColumbia-R-C-20181212000000-101-18',
    });
  });

  it('should generate sort tags for a prioritized L case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        caseType: CASE_TYPES_MAP.cdp,
        receivedAt: '2018-12-12T05:00:00Z',
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateTrialSortTags()).toEqual({
      hybrid: 'WashingtonDistrictofColumbia-H-B-20181212000000-101-18',
      nonHybrid: 'WashingtonDistrictofColumbia-R-B-20181212000000-101-18',
    });
  });

  it('should generate sort tags for a prioritized high priority case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        highPriority: true,
        procedureType: 'Small',
        receivedAt: '2018-12-12T05:00:00Z',
      },
      {
        applicationContext,
      },
    );
    expect(myCase.generateTrialSortTags()).toEqual({
      hybrid: 'WashingtonDistrictofColumbia-H-A-20181212000000-101-18',
      nonHybrid: 'WashingtonDistrictofColumbia-S-A-20181212000000-101-18',
    });
  });
});
