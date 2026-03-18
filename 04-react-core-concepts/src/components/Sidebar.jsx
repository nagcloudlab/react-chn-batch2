const sections = [
  {
    title: 'Props & Effects',
    items: [
      { id: 'props', label: 'Props & useEffect', icon: '{ }' },
    ],
  },
  {
    title: 'State Management',
    items: [
      { id: 'state', label: 'useState', icon: 'S' },
      { id: 'reducer', label: 'useReducer', icon: 'R' },
    ],
  },
  {
    title: 'Context',
    items: [
      { id: 'context', label: 'useContext', icon: 'C' },
    ],
  },
];

function Sidebar({ activeSection, onSectionChange }) {
  return (
    <nav className="sidebar">
      <div className="sidebar-header">
        <h4 className="mb-0">React Core Concepts</h4>
        <small className="text-muted">Interactive Demos</small>
      </div>
      {sections.map((group) => (
        <div key={group.title} className="sidebar-group">
          <div className="sidebar-group-title">{group.title}</div>
          {group.items.map((item) => (
            <button
              key={item.id}
              className={`sidebar-item${activeSection === item.id ? ' active' : ''}`}
              onClick={() => onSectionChange(item.id)}
            >
              <span className="sidebar-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  );
}

export default Sidebar;
