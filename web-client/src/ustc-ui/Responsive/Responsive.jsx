import React from 'react';
import Responsive from 'react-responsive';

export const NonMobile = props => <Responsive {...props} minWidth={640} />;
export const Mobile = props => <Responsive {...props} maxWidth={639} />;
