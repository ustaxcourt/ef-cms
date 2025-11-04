import { docketEntrySeeds } from '@web-api/persistence/postgres/utils/seed/fixtures/docketEntries';
import { groupBy } from 'lodash';

function main() {
  // find cases that share docketentryid
  // put docketNumbers of cases that have that dockentry id into an array
  // add this new array to any docketEntries that share this entryid

  const result = groupBy(docketEntrySeeds, 'docketEntryId');
  Object.values(result).forEach(arr => {
    const multiDocketedOn: string[] = [];
    if (arr.length > 1) {
      for (const element of arr) {
        multiDocketedOn.push(element.docketNumber);
      }
      for (const element of arr) {
        element.multiDocketedOn = multiDocketedOn;
      }
    }
  });
  console.log(docketEntrySeeds);
}

main();
