/// <reference path="./.sst/platform/config.d.ts" />

// eslint-disable-next-line import/no-default-export
export default $config({
  app(input) {
    return {
      home: 'aws',
      name: 'message-service',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
    };
  },
  async run() {
    const hono = new sst.aws.Function('Hono', {
      handler: 'src/runtimes/aws.handler',
      url: true,
    });

    return {
      api: hono.url,
    };
  },
});
