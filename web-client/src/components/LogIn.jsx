import React from 'react';

export default function LogIn() {
  return (
    <section className="usa-section usa-grid">
      <h1>Log in</h1>
      <form>
        <div className="usa-form-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="input" />
        </div>
        <input type="submit" value="Log in" />
      </form>
    </section>
  );
}
