import { Buttons } from './Buttons';
import { Cards } from './Cards';
import { Forms } from './Forms';
import { Tables } from './Tables';
import { TabsSection as Tabs } from './Tabs';
import { Typography } from './Typography';
import React from 'react';

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
