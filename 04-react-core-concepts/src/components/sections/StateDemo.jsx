import { useState } from 'react';
import Message from '../Message';

function StateDemo() {
  const [message, setMessage] = useState('Greetings!');

  return (
    <section id="state">
      <h2>useState</h2>
      <p className="lead">
        <code>useState</code> adds local state to a function component. Calling the setter
        triggers a re-render with the new value.
      </p>
      <ul>
        <li><strong>State variable</strong> &mdash; holds the current value</li>
        <li><strong>Setter function</strong> &mdash; updates state and triggers re-render</li>
        <li><strong>Initial value</strong> &mdash; passed as argument to <code>useState</code></li>
        <li><strong>Immutable updates</strong> &mdash; always replace, never mutate</li>
      </ul>

      <div className="card demo-card">
        <div className="card-header">
          <strong>Greeting Message</strong> &mdash; click a button to change the message state
        </div>
        <div className="card-body">
          <div className="d-flex gap-2 mb-3 flex-wrap">
            <button onClick={() => setMessage('Good Morning')} className="btn btn-outline-warning">
              Good Morning
            </button>
            <button onClick={() => setMessage('Good Afternoon')} className="btn btn-outline-info">
              Good Afternoon
            </button>
            <button onClick={() => setMessage('Good Evening')} className="btn btn-outline-primary">
              Good Evening
            </button>
          </div>
          <Message message={message} />
        </div>
      </div>

      <div className="code-snippet">
        <code>const [message, setMessage] = useState('Greetings!')</code> &bull;{' '}
        <code>setMessage('Good Morning')</code> triggers re-render
      </div>
    </section>
  );
}

export default StateDemo;
