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

const mockContext = {
  fail: jest.fn(),
  succeed: jest.fn(),
} as unknown as Context;

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

  it('returns immediately if no recipients are defined', async () => {
    delete process.env.INACTIVITY_REPORT_RECIPIENTS;
    await handler({}, mockContext, () => {});
    expect(generateStaleCasesReport).not.toHaveBeenCalled();
    expect(mockContext.fail).toHaveBeenCalledWith('No Recipients found.');
  });

  it('catches errors thrown by generateStaleCasesReport', async () => {
    generateStaleCasesReport.mockRejectedValueOnce('Some error');
    await handler({}, mockContext, () => {});
    expect(generateStaleCasesReport).toHaveBeenCalledTimes(1);
    expect(existsSync).not.toHaveBeenCalled();
    expect(mockContext.fail).toHaveBeenCalledWith(
      'Unable to generate stale cases report.',
    );
  });

  it('returns if the stale cases report was unable to be generated', async () => {
    mockExistsSync.mockReturnValueOnce(false);
    await handler({}, mockContext, () => {});
    expect(generateStaleCasesReport).toHaveBeenCalledTimes(1);
    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(sendEmailWithAttachment).not.toHaveBeenCalled();
    expect(mockContext.fail).toHaveBeenCalledWith(
      'Unable to generate stale cases report.',
    );
  });

  it('catches errors thrown by sendEmailWithAttachment', async () => {
    sendEmailWithAttachment.mockRejectedValueOnce('Some error');
    await handler({}, mockContext, () => {});
    expect(generateStaleCasesReport).toHaveBeenCalledTimes(1);
    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(sendEmailWithAttachment).toHaveBeenCalledTimes(1);
    expect(mockContext.fail).toHaveBeenCalledWith({
      'jest@example.com': 'error',
    });
  });

  it('sends emails to all of the defined recipients', async () => {
    process.env.INACTIVITY_REPORT_RECIPIENTS =
      'jest@example.com,alsojest@example.com';
    await handler({}, mockContext, () => {});
    expect(generateStaleCasesReport).toHaveBeenCalledTimes(1);
    expect(existsSync).toHaveBeenCalledTimes(1);
    expect(sendEmailWithAttachment).toHaveBeenCalledTimes(2);
    expect(mockContext.succeed).toHaveBeenCalledWith({
      'jest@example.com': 'sent',
      'alsojest@example.com': 'sent',
    });
  });
});
