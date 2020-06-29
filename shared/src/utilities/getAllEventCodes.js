const courtIssuedEventCodes = require('../tools/courtIssuedEventCodes.json');
const documentMapExternal = require('../tools/externalFilingEvents.json');
const documentMapInternal = require('../tools/internalFilingEvents.json');
const { EVENT_CODES } = require('../business/entities/EntityConstants');

const eventCodes = [];
for (const category in documentMapExternal) {
  for (const document of documentMapExternal[category]) {
    eventCodes.push(document.eventCode);
  }
}
for (const category in documentMapInternal) {
  for (const document of documentMapInternal[category]) {
    eventCodes.push(document.eventCode);
  }
}
for (const document of courtIssuedEventCodes) {
  eventCodes.push(document.eventCode);
}

const results = Array.from(new Set(eventCodes.concat(EVENT_CODES))).sort();

exports.getAllEventCodes = () => {
  return results;
};
