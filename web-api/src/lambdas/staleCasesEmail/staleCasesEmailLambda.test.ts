import * as sendRawEmail from '@web-api/dispatchers/ses/sendEmailWithAttachment';
import * as staleCasesReport from '../../../../scripts/reports/stale-cases.helpers';
import type { Context } from 'aws-lambda';
import { handler } from './staleCasesEmailLambda';
import { existsSync } from 'fs';

jest.mock('../../../../scripts/reports/stale-cases.helpers');
const generateStaleCasesReport = jest
  .spyOn(staleCasesReport, 'generateStaleCasesReport')
  .mockImplementation(jest.fn());

jest.mock('@web-api/dispatchers/ses/sendEmailWithAttachment');
const sendEmailWithAttachment = jest
  .spyOn(sendRawEmail, 'sendEmailWithAttachment')
  .mockImplementation(jest.fn());

jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');
  return {
    __esModule: true,
    ...originalModule,
    existsSync: jest.fn().mockReturnValue(true),
  };
});
const mockExistsSync = existsSync as jest.Mock;

const mockContext = {} as unknown as Context;

describe('staleCasesEmailLambda', () => {
  console.log = () => null;
  console.error = () => null;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env.EMAIL_SOURCE = 'noreply@example.com';
    process.env.INACTIVITY_REPORT_RECIPIENTS = 'jest@example.com';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error if no recipients are defined', async () => {
    delete process.env.INACTIVITY_REPORT_RECIPIENTS;
    await expect(handler({}, mockContext, () => {})).rejects.toThrow(
      'No Recipients found.',
    );
    expect(generateStaleCasesReport).not.toHaveBeenCalled();
  });

  it('catches errors thrown by generateStaleCasesReport', async () => {
    generateStaleCasesReport.mockRejectedValueOnce('Some error');
    await expect(handler({}, mockContext, () => {})).rejects.toThrow(
      'Unable to generate stale cases report.',
    );
    expect(generateStaleCasesReport).toHaveBeenCalledTimes(1);
    expect(existsSync).not.toHaveBeenCalled();
  });

  it('throws an error if the stale cases report was unable to be generated', async () => {
    mockExistsSync.mockReturnValueOnce(false);
    await expect(handler({}, mockContext, () => {})).rejects.toThrow(
      'Unable to generate stale cases report.',
    );
    expect(generateStaleCasesReport).toHaveBeenCalledTimes(1);
    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(sendEmailWithAttachment).not.toHaveBeenCalled();
  });

  it('catches errors thrown by sendEmailWithAttachment', async () => {
    sendEmailWithAttachment.mockRejectedValueOnce('Some error');
    await expect(handler({}, mockContext, () => {})).rejects.toThrow(
      JSON.stringify({ 'jest@example.com': 'error' }),
    );
    expect(generateStaleCasesReport).toHaveBeenCalledTimes(1);
    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(sendEmailWithAttachment).toHaveBeenCalledTimes(1);
  });

  it('sends emails to all of the defined recipients', async () => {
    process.env.INACTIVITY_REPORT_RECIPIENTS =
      'jest@example.com,alsojest@example.com';
    await expect(handler({}, mockContext, () => {})).resolves.not.toThrow();
    expect(generateStaleCasesReport).toHaveBeenCalledTimes(1);
    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(sendEmailWithAttachment).toHaveBeenCalledTimes(2);
  });
});
