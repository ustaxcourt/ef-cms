import React from 'react';
import Responsive from 'react-responsive';

export const NonMobile = props => <Responsive {...props} minWidth={640} />;
NonMobile.displayName = 'NonMobile';

export const Mobile = props => <Responsive {...props} maxWidth={639} />;
Mobile.displayName = 'Mobile';
