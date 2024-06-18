// AWS lambda handlers must be async to work properly
/* eslint-disable require-await */
import { CloudFrontRequest, CloudFrontRequestEvent } from 'aws-lambda';

export const handler = async (
  awsEvent: CloudFrontRequestEvent,
): Promise<CloudFrontRequest> => {
  const { request } = awsEvent.Records[0].cf;
  request.uri = `/${[...request.uri.split('/').slice(2)].join('/')}`;
  return request;
};
