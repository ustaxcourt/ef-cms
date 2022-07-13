const React = require('react');

export const EmailHeader = ({ date }) => {
  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <h1
          data-testid="header"
          style={{ fontSize: '20px', marginBottom: '0' }}
        >
          United States Tax Court
        </h1>
        <div style={{ fontSize: '16px' }}>
          <div data-testid="location">Washington, DC 20217</div>
          {date && (
            <div data-testid="date" style={{ marginTop: '15px' }}>
              {date}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
