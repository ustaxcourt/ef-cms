const courtIssuedEventCodes = require('../tools/courtIssuedEventCodes.json');
const documentMapExternal = require('../tools/externalFilingEvents.json');
const documentMapInternal = require('../tools/internalFilingEvents.json');
const { Document } = require('../business/entities/Document');

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

const results = Array.from(
  new Set(eventCodes.concat(Document.eventCodes)),
).sort();

exports.getAllEventCodes = () => {
  return results;
};
