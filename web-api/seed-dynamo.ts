const { seedLocalDatabase } = require('./storage/scripts/seedLocalDatabase');

const args = process.argv.slice(2);

const main = async () => {
  let entries;

  if (args[0]) {
    // eslint-disable-next-line security/detect-non-literal-require
    entries = require(args[0]);
    entries = entries.filter(
      record => !record.pk.startsWith('stream-event-id'),
    );
  }

  await seedLocalDatabase(entries);
};

main();
