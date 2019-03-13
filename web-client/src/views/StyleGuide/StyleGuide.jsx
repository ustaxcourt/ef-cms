import React from 'react';

import { Buttons } from './Buttons';
import { Cards } from './Cards';
import { Forms } from './Forms';
import { Tables } from './Tables';
import { Tabs } from './Tabs';
import { Typography } from './Typography';

export const StyleGuide = () => (
  <React.Fragment>
    <Typography />
    <Buttons />
    <Tables />
    <Forms />
    <Cards />
    <Tabs />
  </React.Fragment>
);
