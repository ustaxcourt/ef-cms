const createApplicationContext = require('../src/applicationContext');
const { addWorkingCopy } = require('./00011-trial-clerk-working-copy');

const applicationContext = createApplicationContext({});

let queryMock;
let documentClient = applicationContext.getDocumentClient();
let foundWorkingCopy;

const TRIAL_CLERK_USER_ID_1 = 'e23f4957-1473-4fc5-878a-df6492d6bd8a';
const TRIAL_SESSION_ID_1 = 'cb6b1eb1-de70-4df5-92dd-c3dc8da00272';
const trialSessionItem = {
  caseOrder: [],
  gsi1pk: 'trial-session-catalog',
  maxCases: 1,
  pk: `trial-session-${TRIAL_SESSION_ID_1}`,
  sk: `trial-session-${TRIAL_SESSION_ID_1}`,
  trialSessionId: TRIAL_SESSION_ID_1,
};
const tableName = 'Test';

describe("create working copy for assigned trial clerk when it doesn't exist", () => {
  beforeEach(() => {
    foundWorkingCopy = null;
    queryMock = jest.fn(() => {
      const Items = [];
      if (foundWorkingCopy) {
        Items.push(foundWorkingCopy);
      }
      return {
        promise: () => ({
          Items,
        }),
      };
    });

    documentClient.query = queryMock;
  });

  it('does not proceed if the item is NOT a trialSession record', async () => {
    // a valid trial session should have caseOrder, trialSessionId, and maxCases
    const item = {
      caseType: 'Case Type', // not a valid trial session
    };

    const result = await addWorkingCopy(item, documentClient, tableName);

    expect(result).toBeUndefined;
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('does not proceed if the item DOES NOT have an assigned trialClerk', async () => {
    const item = {
      ...trialSessionItem, // valid trial session
    };

    const result = await addWorkingCopy(item, documentClient, tableName);

    expect(result).toBeUndefined;
    expect(queryMock).not.toHaveBeenCalled();
  });

  it('looks for a trialSessionWorkingCopy item for the given trial clerk', async () => {
    const item = {
      ...trialSessionItem, // valid trial session
      trialClerk: {
        userId: TRIAL_CLERK_USER_ID_1,
      },
    };

    await addWorkingCopy(item, documentClient, tableName);

    expect(queryMock).toHaveBeenCalled();
  });

  it('does not proceed if a working copy already exists for the given trial clerk', async () => {
    // this is the working copy to be returned in the query
    foundWorkingCopy = {
      pk: `trial-session-working-copy|${TRIAL_SESSION_ID_1}`,
      sk: `${TRIAL_CLERK_USER_ID_1}`,
    };

    const item = {
      ...trialSessionItem, // valid trial session
      trialClerk: {
        userId: TRIAL_CLERK_USER_ID_1,
      },
    };

    const result = await addWorkingCopy(item, documentClient, tableName);

    expect(queryMock).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('returns a new trialSessionWorkingCopy to be inserted if one is not found for the given trial clerk', async () => {
    const item = {
      ...trialSessionItem, // valid trial session
      trialClerk: {
        userId: TRIAL_CLERK_USER_ID_1,
      },
    };

    const result = await addWorkingCopy(item, documentClient, tableName);

    expect(queryMock).toHaveBeenCalled();
    expect(result).toMatchObject({
      pk: `trial-session-working-copy|${TRIAL_SESSION_ID_1}`,
      sk: `${TRIAL_CLERK_USER_ID_1}`,
    });
  });
});
