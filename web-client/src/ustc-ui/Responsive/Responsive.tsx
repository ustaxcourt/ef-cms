import { MOBILE_SCREEN_BREAKPOINT } from '@shared/business/entities/EntityConstants';
import React from 'react';
import Responsive from 'react-responsive';

export const NonMobile = props => <Responsive {...props} minWidth={MOBILE_SCREEN_BREAKPOINT} />;
NonMobile.displayName = 'NonMobile';

export const Mobile = props => <Responsive {...props} maxWidth={MOBILE_SCREEN_BREAKPOINT - 1} />;
Mobile.displayName = 'Mobile';

export const Phone = props => <Responsive {...props} maxWidth={479} />;
Mobile.displayName = 'Phone';

export const NonPhone = props => <Responsive {...props} minWidth={480} />;
Mobile.displayName = 'NonPhone';
