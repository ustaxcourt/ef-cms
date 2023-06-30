/* eslint-disable spellcheck/spell-checker */
/* eslint-disable security/detect-non-literal-regexp */
/**
 * npm install --save-dev @babel/core @babel/node
 * find web-client/src/ -name '*.jsx' | xargs npx babel-node sequenceAudit.js
 *
 npx babel-node sequenceAudit.js web-client/src/views/CaseDetail/AddToTrialModal.jsx
 */
const fs = require('fs');
const { presenter } = require('./web-client/src/presenter/presenter');
const declaredSequenceNames = Object.keys(presenter.sequences);

const globalSequenceUsageCount = {};
declaredSequenceNames.forEach(name => (globalSequenceUsageCount[name] = 0));

const logMessages = [];
logMessages.clear = function () {
  this.length = 0;
};
const warn = message => logMessages.push(message);

/**
 * @param {string} fileContents  the source of a React Component
 * @returns {object} a collection of sequence and state connections
 */
function getConnectedCerebral(fileContents) {
  const connectionMap = { props: {}, sequences: {}, state: {} };
  const connectMatcher = /(\w+):\s+(props|sequences|state)\.([^,]+)/gim;
  [...fileContents.matchAll(connectMatcher)].forEach(match => {
    let [connectionStatement, jsName, connectionType, cerebralName] = match;
    cerebralName = stripWhitespace(cerebralName);

    // if name used in view doesn't match exported name, log a warning.
    // if (connectionType == 'sequences' && jsName !== cerebralName) {
    //   const connection = connectionStatement.replace(/\s+/g, ' ');
    //   warn(`  ! sequence name doesn't match definition name "${connection}"`);
    // }
    fileContents = fileContents.replace(
      new RegExp(connectionStatement, 'gim'),
      '',
    );
    if (!Object.keys(connectionMap).includes(connectionType)) {
      throw new Error(`Unrecognized connection type ${connectionType}`);
    }
    connectionMap[connectionType][jsName] = cerebralName;
    if (connectionType == 'sequences') {
      delete globalSequenceUsageCount[cerebralName];
    }
  });
  return { connectionMap, fileContents };
}

/**
 *
 */
function stripWhitespace(str) {
  return str.replace(/\s+/gim, '');
}
/**
 *
 */
function getConnectionReferenceCount(sequenceName, fileContents) {
  // edge-case: could produce false-positive "yep I found it" matches if one sequence is a substring of another.
  // eslint-disable-next-line security/detect-non-literal-regexp
  return [...fileContents.matchAll(new RegExp(sequenceName, 'gim'))].length;
}

/**
 *
 */
function collectConnectionData(fileContents) {
  let connectionMap;
  ({ connectionMap, fileContents } = getConnectedCerebral(fileContents));
  const reportUnused = ([connectionType, connectionMap1]) => {
    Object.keys(connectionMap1).forEach(connectionReference => {
      const result = getConnectionReferenceCount(
        connectionReference,
        fileContents,
      );
      if (result <= 1) {
        // one for the connection argument of the component itself
        warn(
          `  ~ "${connectionType}" connection "${connectionReference}" appears unused`,
        );
      }
    });
  };
  Object.entries(connectionMap).forEach(reportUnused);
}

const readFile = filePath => {
  const contents = fs.readFileSync(filePath, {
    encoding: 'utf8',
  });
  return contents;
};

const filePaths = [...process.argv].slice(2);

filePaths.forEach(view => {
  collectConnectionData(readFile(view));
  if (logMessages.length > 0) {
    console.log('> ', view);
    logMessages.forEach(message => console.warn(message));
    logMessages.clear();
  }
});
Object.keys(globalSequenceUsageCount).forEach(sequenceName => {
  console.log(`  ? is ${sequenceName} unused?`); // honestly, it is probably a quoted string passed to a component somewhere
});

console.log('Checked', filePaths.length, 'files');
