import A from '../A';
import ColorContext from '../../contexts/ColorContext';

function ContextDemo() {
  return (
    <section id="context">
      <h2>useContext</h2>
      <p className="lead">
        <code>useContext</code> lets you read context values without prop drilling.
        A Provider wraps a subtree, and any descendant can consume the value directly.
      </p>
      <ul>
        <li><strong>createContext</strong> &mdash; creates a context with a default value</li>
        <li><strong>Provider</strong> &mdash; wraps components and supplies a value</li>
        <li><strong>useContext</strong> &mdash; reads the nearest Provider's value</li>
        <li><strong>No prop drilling</strong> &mdash; intermediate components (B) don't need to pass props</li>
      </ul>

      <div className="card demo-card">
        <div className="card-header">
          <strong>Color Context</strong> &mdash; two Providers with different values
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="context-label">
                <code>{'<ColorContext.Provider value="red">'}</code>
              </div>
              <ColorContext.Provider value="red">
                <A />
              </ColorContext.Provider>
            </div>
            <div className="col-md-6">
              <div className="context-label">
                <code>{'<ColorContext.Provider value="green">'}</code>
              </div>
              <ColorContext.Provider value="green">
                <A />
              </ColorContext.Provider>
            </div>
          </div>
        </div>
      </div>

      <div className="code-snippet">
        Component <strong>A</strong> and <strong>C</strong> use <code>useContext(ColorContext)</code> &bull;{' '}
        Component <strong>B</strong> does not &mdash; context skips intermediate components
      </div>
    </section>
  );
}

export default ContextDemo;
