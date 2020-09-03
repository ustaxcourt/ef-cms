import { BigHeader } from '../BigHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const HealthCheck = connect(
  {
    health: state.health,
  },
  function HealthCheck({ health }) {
    return (
      <>
        {console.log(health)}
        <BigHeader text="Health Check" />
        <section className="usa-section grid-container">
          <div className="grid-row grid-gap">
            <div className="grid-col-6">
              {' '}
              <div className="margin-bottom-1">
                Dynamsoft
                <FontAwesomeIcon
                  className="margin-left-1"
                  color={health.dynamsoft ? 'green' : 'red'}
                  icon="check-circle"
                />
              </div>
              <div>
                S3
                <div className="margin-bottom-1 margin-top-1 margin-left-1">
                  East Documents
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.eastS3BucketName ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  West Documents
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.westS3BucketName ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  East Temp Documents
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.eastS3TempBucketName ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  West Temp Documents
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.westS3TempBucketName ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  App
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.appS3Bucket ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  Public
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.publicS3Bucket ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  Public Failover
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.publicFailoverS3Bucket ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-left-1">
                  App Failover
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.s3.appFailoverS3Bucket ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
              </div>
            </div>
            <div className="grid-col-6">
              <div>
                Dynamo
                <div className="margin-bottom-1 margin-top-1 margin-left-1">
                  EFCMS
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.dynamo.efcms ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
                <div className="margin-bottom-1 margin-left-1">
                  EFCMS Deploy
                  <FontAwesomeIcon
                    className="margin-left-1"
                    color={health.dynamo.efcmsDeploy ? 'green' : 'red'}
                    icon="check-circle"
                  />
                </div>
              </div>
              <div className="margin-bottom-1">
                Cognito
                <FontAwesomeIcon
                  className="margin-left-1"
                  color={health.cognito ? 'green' : 'red'}
                  icon="check-circle"
                />
              </div>
              <div className="margin-bottom-1">
                Elasticsearch
                <FontAwesomeIcon
                  className="margin-left-1"
                  color={health.elasticsearch ? 'green' : 'red'}
                  icon="check-circle"
                />
              </div>
              <div>
                Email Service
                <FontAwesomeIcon
                  className="margin-left-1"
                  color={health.emailService ? 'green' : 'red'}
                  icon="check-circle"
                />
              </div>
            </div>
          </div>
        </section>
      </>
    );
  },
);
