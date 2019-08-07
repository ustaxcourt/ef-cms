import { connect } from '@cerebral/react';
import React from 'react';

export const JudgeOptions = connect(
  {},
  () => {
    return (
      <>
        {/* hardcoding these for #1191 - will be dynamic at some point */}
        <option value="Judge Armen">Judge Armen</option>
        <option value="Judge Ashford">Judge Ashford</option>
        <option value="Judge Buch">Judge Buch</option>
        <option value="Judge Carluzzo">Judge Carluzzo</option>
        <option value="Judge Cohen">Judge Cohen</option>
        <option value="Judge Colvin">Judge Colvin</option>
        <option value="Judge Copeland">Judge Copeland</option>
        <option value="Judge Foley">Judge Foley</option>
        <option value="Judge Gale">Judge Gale</option>
        <option value="Judge Gerber">Judge Gerber</option>
        <option value="Judge Goeke">Judge Goeke</option>
        <option value="Judge Gustafson">Judge Gustafson</option>
        <option value="Judge Guy">Judge Guy</option>
        <option value="Judge Halpern">Judge Halpern</option>
        <option value="Judge Holmes">Judge Holmes</option>
        <option value="Judge Jacobs">Judge Jacobs</option>
        <option value="Judge Kerrigan">Judge Kerrigan</option>
        <option value="Judge Lauber">Judge Lauber</option>
        <option value="Judge Leyden">Judge Leyden</option>
        <option value="Judge Marvel">Judge Marvel</option>
        <option value="Judge Morrison">Judge Morrison</option>
        <option value="Judge Negas">Judge Negas</option>
        <option value="Judge Panuthos">Judge Panuthos</option>
        <option value="Judge Paris">Judge Paris</option>
        <option value="Judge Pugh">Judge Pugh</option>
        <option value="Judge Ruwe">Judge Ruwe</option>
        <option value="Judge Thorton">Judge Thorton</option>
        <option value="Judge Urda">Judge Urda</option>
        <option value="Judge Vasquez">Judge Vasquez</option>
        <option value="Judge Wells">Judge Wells</option>
      </>
    );
  },
);
