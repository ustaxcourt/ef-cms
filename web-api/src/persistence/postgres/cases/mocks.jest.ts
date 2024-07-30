jest.mock('@web-api/persistence/postgres/cases/upsertCase', () => ({
  upsertCase: jest.fn(),
}));
