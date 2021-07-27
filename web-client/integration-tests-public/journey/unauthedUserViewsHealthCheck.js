export const unauthedUserViewsHealthCheck = cerebralTest => {
  return it('should view health check', async () => {
    await cerebralTest.runSequence('gotoHealthCheckSequence', {});

    expect(cerebralTest.getState('health')).toEqual(
      expect.objectContaining({
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
          eastQuarantine: expect.anything(),
          eastTempDocuments: expect.anything(),
          public: expect.anything(),
          publicFailover: expect.anything(),
          westDocuments: expect.anything(),
          westQuarantine: expect.anything(),
          westTempDocuments: expect.anything(),
        }),
      }),
    );
  });
};
