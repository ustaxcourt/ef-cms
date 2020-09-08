export const unauthedUserViewsHealthCheck = test => {
  return it('should view health check', async () => {
    await test.runSequence('gotoHealthCheckSequence', {});

    expect(test.getState('health')).toEqual(
      expect.objectContaining({
        clamAV: expect.anything(),
        cognito: expect.anything(),
        dynamo: expect.objectContaining({
          efcms: expect.anything(),
          efcmsDeploy: expect.anything(),
        }),
        dynamsoft: expect.anything(),
        elasticsearch: expect.anything(),
        emailService: expect.anything(),
        s3: expect.objectContaining({
          app: expect.anything(),
          appFailover: expect.anything(),
          eastDocuments: expect.anything(),
          eastTempDocuments: expect.anything(),
          public: expect.anything(),
          publicFailover: expect.anything(),
          westDocuments: expect.anything(),
          westTempDocuments: expect.anything(),
        }),
      }),
    );
  });
};
