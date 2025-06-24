import { writeFileSync } from 'fs';
import localSeeds from '../../../../../../../web-api/storage/fixtures/seed/efcms-local.json';

function main() {
  const users = [] as any[];

  localSeeds.forEach(seed => {
    if (
      // seed.pk.startsWith('user|') &&
      // seed.sk.startsWith('user|') //||
      (seed.sk.startsWith('irsPractitioner|') && seed.pk.startsWith('case|')) ||
      (seed.sk.startsWith('privatePractitioner|') &&
        seed.pk.startsWith('case|')) ||
      (seed.sk.startsWith('inactivePractitioner|') &&
        seed.pk.startsWith('case|'))
    ) {
      delete seed.sk;
      seed.dockerNumber = seed.pk.replace('case|', '');
      delete seed.pk;

      users.push(seed);
    }
  });

  writeFileSync('OnlyUsers.json', JSON.stringify(users, null, 2));
}

main();
