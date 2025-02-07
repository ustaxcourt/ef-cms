import { createRootRoute, Outlet } from '@tanstack/react-router';
// Icons - Solid
import { faArrowAltCircleLeft as faArrowAltCircleLeftSolid } from '@fortawesome/free-solid-svg-icons/faArrowAltCircleLeft';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons/faCheckCircle';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons/faChevronUp';
import { faCopy } from '@fortawesome/free-regular-svg-icons/faCopy';
import { faCopy as faCopySolid } from '@fortawesome/free-solid-svg-icons/faCopy';
import { faEnvelope as faEnvelopeSolid } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFileAlt as faFileAltSolid } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faFilePdf } from '@fortawesome/free-solid-svg-icons/faFilePdf';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faLock } from '@fortawesome/free-solid-svg-icons/faLock';
import { faLongArrowAltUp } from '@fortawesome/free-solid-svg-icons/faLongArrowAltUp';
import { faPhone } from '@fortawesome/free-solid-svg-icons/faPhone';
import { faPrint } from '@fortawesome/free-solid-svg-icons/faPrint';
import { faSearch } from '@fortawesome/free-solid-svg-icons/faSearch';
import { faSort } from '@fortawesome/free-solid-svg-icons/faSort';
import { faSync } from '@fortawesome/free-solid-svg-icons/faSync';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
// Icons - Regular
import { faArrowAltCircleLeft as faArrowAltCircleLeftRegular } from '@fortawesome/free-regular-svg-icons/faArrowAltCircleLeft';
import { faExchangeAlt } from '@fortawesome/free-solid-svg-icons/faExchangeAlt';
import { faExclamation } from '@fortawesome/free-solid-svg-icons/faExclamation';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons/faExclamationCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import { faLink } from '@fortawesome/free-solid-svg-icons/faLink';
import { faLongArrowAltDown } from '@fortawesome/free-solid-svg-icons/faLongArrowAltDown';
import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { faTimesCircle as faTimesCircleRegular } from '@fortawesome/free-regular-svg-icons/faTimesCircle';
import { faUser } from '@fortawesome/free-regular-svg-icons/faUser';
import { library } from '@fortawesome/fontawesome-svg-core';
import React from 'react';

export const rootRoute = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  library.add(
    faExchangeAlt,
    faFileAltSolid,
    faLock,
    faLongArrowAltUp,
    faLink,
    faTimes,
    faPrint,
    faFilePdf,
    faSearch,
    faSync,
    faLink,
    faSort,
    faTimesCircle,
    faInfoCircle,
    faCheckCircle,
    faExclamation,
    faExclamationCircle,
    faExclamationTriangle,
    faChevronUp,
    faLongArrowAltDown,
    faEnvelopeSolid,
    faPhone,
    faTimesCircleRegular,
    faArrowAltCircleLeftSolid,
    faArrowAltCircleLeftRegular,
    faUser,
    faCopy,
    faCopySolid,
  );
  // If you are adding components here then you are doing something wrong. Use nested routes or layout routes to add content.
  return (
    <>
      <Outlet />
    </>
  );
}
