import { CloudFrontRequest, CloudFrontRequestEvent } from 'aws-lambda';

// AWS lambda handlers must be async to work properly
export const handler = async (
  awsEvent: CloudFrontRequestEvent,
  // eslint-disable-next-line @typescript-eslint/require-await
): Promise<CloudFrontRequest> => {
  const { request } = awsEvent.Records[0].cf;
  request.uri = `/${[...request.uri.split('/').slice(2)].join('/')}`;
  return request;
};
