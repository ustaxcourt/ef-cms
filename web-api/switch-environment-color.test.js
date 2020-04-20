jest.mock('aws-sdk');

const {
  getNewStack,
  switchBasePathMappings,
} = require('./switch-environment-color');

describe('switch-environment-color', () => {
  describe('switchBasePathMappings', () => {
    const updateBasePathMappingSpy = jest.fn().mockReturnValue({
      promise: async () => {},
    });

    it('should call updateBasePathMapping with the green stack id when switching from blue to green', async () => {
      await switchBasePathMappings({
        apigateway: {
          getBasePathMappings: () => {
            return {
              promise: async () => ({
                items: [
                  {
                    basePath: '/api',
                    restApiId: '123',
                  },
                ],
              }),
            };
          },
          getRestApis: () => {
            return {
              promise: async () => ({
                items: [
                  { id: '123', name: 'something-the-stage-blue' },
                  { id: '234', name: 'something-the-stage-green' },
                ],
              }),
            };
          },
          updateBasePathMapping: updateBasePathMappingSpy,
        },
        currentColor: 'blue',
        fullDomain: 'the-domain',
        newColor: 'green',
        stage: 'the-stage',
      });

      expect(updateBasePathMappingSpy).toBeCalled();
      expect(updateBasePathMappingSpy.mock.calls[0][0]).toMatchObject({
        basePath: '/api',
        domainName: 'the-domain',
        patchOperations: [
          {
            op: 'replace',
            path: '/restapiId',
            value: '234',
          },
        ],
      });
    });

    it('should not call updateBasePathMapping when switching from blue to green if green stack is not present', async () => {
      await switchBasePathMappings({
        apigateway: {
          getBasePathMappings: () => {
            return {
              promise: async () => ({
                items: [
                  {
                    basePath: '/api',
                    restApiId: '123',
                  },
                ],
              }),
            };
          },
          getRestApis: () => {
            return {
              promise: async () => ({
                items: [{ id: '123', name: 'something-the-stage-blue' }],
              }),
            };
          },
          updateBasePathMapping: updateBasePathMappingSpy,
        },
        currentColor: 'blue',
        fullDomain: 'the-domain',
        newColor: 'green',
        stage: 'the-stage',
      });

      expect(updateBasePathMappingSpy).not.toBeCalled();
    });
  });

  describe('getNewStack', () => {
    it('should return the green rest api when switching from blue to green', () => {
      const result = getNewStack({
        basePathMapping: {
          restApiId: '123',
        },
        currentColor: 'blue',
        newColor: 'green',
        restApisFiltered: [
          { id: '123', name: 'something-blue' },
          { id: '234', name: 'something-green' },
        ],
      });

      expect(result).toEqual({ id: '234', name: 'something-green' });
    });

    it('should return the blue rest api when switching from green to blue', () => {
      const result = getNewStack({
        basePathMapping: {
          restApiId: '234',
        },
        currentColor: 'green',
        newColor: 'blue',
        restApisFiltered: [
          { id: '123', name: 'something-blue' },
          { id: '234', name: 'something-green' },
        ],
      });

      expect(result).toEqual({ id: '123', name: 'something-blue' });
    });

    it('should return nothing if switching from green to blue and a green api entry does not exist', () => {
      const result = getNewStack({
        basePathMapping: {
          restApiId: '234',
        },
        currentColor: 'green',
        newColor: 'blue',
        restApisFiltered: [{ id: '123', name: 'something-blue' }],
      });

      expect(result).toBeUndefined();
    });

    it('should return nothing if switching from green to blue and a green api entry does not exist', () => {
      const result = getNewStack({
        basePathMapping: {
          restApiId: '234',
        },
        currentColor: 'green',
        newColor: 'blue',
        restApisFiltered: [{ id: '123', name: 'something-blue' }],
      });

      expect(result).toBeUndefined();
    });

    it('should return nothing if switching from green to blue and a blue api entry does not exist', () => {
      const result = getNewStack({
        basePathMapping: {
          restApiId: '234',
        },
        currentColor: 'green',
        newColor: 'blue',
        restApisFiltered: [{ id: '234', name: 'something-green' }],
      });

      expect(result).toBeUndefined();
    });
  });
});
