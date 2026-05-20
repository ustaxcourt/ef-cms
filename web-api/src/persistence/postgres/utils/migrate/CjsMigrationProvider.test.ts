import * as path from 'path';
import { promises as fs } from 'fs';
import { CjsMigrationProvider } from './CjsMigrationProvider';

jest.mock('fs', () => ({ promises: { readdir: jest.fn() } }));

const mockReaddir = fs.readdir as jest.Mock;
const migrationFolder = '/fake/migrations';

describe('CjsMigrationProvider', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an empty object when the folder contains no .ts or .js files', async () => {
    mockReaddir.mockResolvedValue(['README.md', '.gitkeep'] as any);
    const provider = new CjsMigrationProvider(migrationFolder);
    expect(await provider.getMigrations()).toEqual({});
  });

  it('loads .ts migration files via require and keys them by filename without extension', async () => {
    mockReaddir.mockResolvedValue([
      '0001-init.ts',
      '0002-add-column.ts',
    ] as any);
    const fakeMigration1 = { up: jest.fn(), down: jest.fn() };
    const fakeMigration2 = { up: jest.fn() };
    jest.doMock(
      path.join(migrationFolder, '0001-init.ts'),
      () => fakeMigration1,
      { virtual: true },
    );
    jest.doMock(
      path.join(migrationFolder, '0002-add-column.ts'),
      () => fakeMigration2,
      { virtual: true },
    );
    const provider = new CjsMigrationProvider(migrationFolder);
    const result = await provider.getMigrations();
    expect(Object.keys(result)).toEqual(['0001-init', '0002-add-column']);
    expect(result['0001-init']).toBe(fakeMigration1);
    expect(result['0002-add-column']).toBe(fakeMigration2);
  });

  it('includes .js files when present', async () => {
    mockReaddir.mockResolvedValue(['0003-compiled.js'] as any);
    const fakeMigration = { up: jest.fn() };
    jest.doMock(
      path.join(migrationFolder, '0003-compiled.js'),
      () => fakeMigration,
      { virtual: true },
    );
    const provider = new CjsMigrationProvider(migrationFolder);
    const result = await provider.getMigrations();
    expect(Object.keys(result)).toEqual(['0003-compiled']);
    expect(result['0003-compiled']).toBe(fakeMigration);
  });

  it('skips files that are neither .ts nor .js', async () => {
    mockReaddir.mockResolvedValue([
      'migration.ts',
      'notes.txt',
      'schema.sql',
      'data.json',
    ] as any);
    const fakeMigration = { up: jest.fn() };
    jest.doMock(
      path.join(migrationFolder, 'migration.ts'),
      () => fakeMigration,
      { virtual: true },
    );
    const provider = new CjsMigrationProvider(migrationFolder);
    const result = await provider.getMigrations();
    expect(Object.keys(result)).toEqual(['migration']);
  });
});
