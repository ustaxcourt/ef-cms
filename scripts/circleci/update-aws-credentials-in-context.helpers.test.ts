import {
  getContexts,
  getOrganizationId,
  updateContextVariable,
} from '../../shared/admin-tools/circleci/circleci-helper';
import { updateAwsCredentialsInContext } from './update-aws-credentials-in-context.helpers';

jest.mock('../../shared/admin-tools/circleci/circleci-helper');
const mockedGetOrganizationId = getOrganizationId as jest.Mock;
const mockedGetContexts = getContexts as jest.Mock;
const mockedUpdateContextVariable = updateContextVariable as jest.Mock;

describe('update-aws-credentials-in-context', () => {
  const apiToken = 'test-token';
  const awsAccessKeyId = 'new-access-key';
  const awsSecretAccessKey = 'new-secret-key';
  const projectSlug = 'github/ustaxcourt/ef-cms';
  const contextName = 'efcms-prod';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('updates the specific context provided', async () => {
    mockedGetOrganizationId.mockResolvedValue('org-123');
    mockedGetContexts.mockResolvedValue([
      { id: '1', name: 'efcms-prod' },
      { id: '2', name: 'efcms-test' },
    ]);
    mockedUpdateContextVariable.mockResolvedValue(undefined);

    await updateAwsCredentialsInContext({
      apiToken,
      awsAccessKeyId,
      awsSecretAccessKey,
      contextName,
      projectSlug,
    });

    expect(mockedGetOrganizationId).toHaveBeenCalledWith({
      apiToken,
      projectSlug,
    });
    expect(mockedGetContexts).toHaveBeenCalledWith({
      apiToken,
      ownerId: 'org-123',
    });

    // Should only update efcms-prod
    expect(mockedUpdateContextVariable).toHaveBeenCalledTimes(2);

    expect(mockedUpdateContextVariable).toHaveBeenCalledWith({
      apiToken,
      contextId: '1',
      variableName: 'AWS_ACCESS_KEY_ID',
      variableValue: awsAccessKeyId,
    });
    expect(mockedUpdateContextVariable).toHaveBeenCalledWith({
      apiToken,
      contextId: '1',
      variableName: 'AWS_SECRET_ACCESS_KEY',
      variableValue: awsSecretAccessKey,
    });
  });

  it('throws an error if the context is not found', async () => {
    mockedGetOrganizationId.mockResolvedValue('org-123');
    mockedGetContexts.mockResolvedValue([{ id: '2', name: 'efcms-test' }]);

    await expect(
      updateAwsCredentialsInContext({
        apiToken,
        awsAccessKeyId,
        awsSecretAccessKey,
        contextName,
        projectSlug,
      }),
    ).rejects.toThrow(`Context '${contextName}' not found.`);
  });
});
