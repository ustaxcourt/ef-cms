import { clearDatabase, seedDatabase } from './utils/database';
import { loginAs, setupTest } from './helpers';
import path from 'path';

describe('Petitioner accesses a case that does not belong to them, but is part of a consolidated group associated with a case that does belong to them', () => {
  const cerebralTest = setupTest();

  beforeAll(async () => {
    await clearDatabase();
    await seedDatabase(
      path.resolve(__dirname, './fixtures/consolidated-cases.json'),
    );
  });

  afterAll(async () => {
    cerebralTest.closeSocket();
    await clearDatabase();
    await seedDatabase(
      path.resolve(
        __dirname,
        '../../web-api/storage/fixtures/seed/efcms-local.json',
      ),
    );
  });

  loginAs(cerebralTest, 'petitioner2@example.com');
});
