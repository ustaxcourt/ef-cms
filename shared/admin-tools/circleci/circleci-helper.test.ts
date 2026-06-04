import {
  getContexts,
  getOrganizationId,
  updateContextVariable,
} from './circleci-helper';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('circleci-helper', () => {
  const apiToken = 'test-token';

  describe('getOrganizationId', () => {
    it('returns the organization_id from the project response', async () => {
      const projectSlug = 'github/ustaxcourt/ef-cms';
      const organizationId = 'test-org-id';
      mockedAxios.get.mockResolvedValue({
        data: { organization_id: organizationId },
      });

      const result = await getOrganizationId({ apiToken, projectSlug });

      expect(result).toEqual(organizationId);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://circleci.com/api/v2/project/${projectSlug}`,
        { headers: { 'Circle-Token': apiToken } },
      );
    });
  });

  describe('getContexts', () => {
    it('returns the list of contexts for an organization', async () => {
      const ownerId = 'test-org-id';
      const contexts = [
        { id: 'context-1', name: 'efcms-prod' },
        { id: 'context-2', name: 'efcms-test' },
      ];
      mockedAxios.get.mockResolvedValue({
        data: { items: contexts },
      });

      const result = await getContexts({ apiToken, ownerId });

      expect(result).toEqual(contexts);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `https://circleci.com/api/v2/context?owner-id=${ownerId}&owner-type=organization`,
        { headers: { 'Circle-Token': apiToken } },
      );
    });
  });

  describe('updateContextVariable', () => {
    it('calls the CircleCI API to update a context variable', async () => {
      const contextId = 'test-context-id';
      const variableName = 'AWS_ACCESS_KEY_ID';
      const variableValue = 'new-access-key';
      mockedAxios.put.mockResolvedValue({});

      await updateContextVariable({
        apiToken,
        contextId,
        variableName,
        variableValue,
      });

      expect(mockedAxios.put).toHaveBeenCalledWith(
        `https://circleci.com/api/v2/context/${contextId}/environment-variable/${variableName}`,
        { value: variableValue },
        {
          headers: {
            'Circle-Token': apiToken,
            'Content-Type': 'application/json',
          },
        },
      );
    });
  });
});
