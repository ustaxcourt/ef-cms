const applicationContext = require('../../../src/applicationContext');
const fs = require('fs');
const path = require('path');
const {
  TrialSession,
} = require('../../../../shared/src/business/entities/trialSessions/TrialSession');

const data = require('./efcms-local.json');

for (let i = 0; i < data.length; i++) {
  const entry = data[i];
  if (entry.gsi1pk === 'trial-session-catalog') {
    console.log('hi');

    data[i] = {
      ...data[i],
      ...new TrialSession(entry, { applicationContext })
        .validate()
        .toRawObject(),
    };
  }
}

fs.writeFileSync(
  path.join(__dirname, './efcms-local.json'),
  JSON.stringify(data, null, 2),
);
