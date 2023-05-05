import React from 'react';

export const EmailHeader = ({ date }) => {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '20px', marginBottom: '0' }}>
          United States Tax Court
        </h1>
        <div style={{ fontSize: '16px' }}>
          <div>Washington, DC 20217</div>
          {date && <div style={{ marginTop: '15px' }}>{date}</div>}
        </div>
      </div>
    </>
  );
};
