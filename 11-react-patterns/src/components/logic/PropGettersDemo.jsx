import { useState, useId } from 'react'

function useDropdown({ items = [] } = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const menuId = useId()

  const toggle = () => setIsOpen(prev => !prev)
  const close = () => setIsOpen(false)
  const select = (index) => {
    setSelectedIndex(index)
    setIsOpen(false)
  }

  const getToggleProps = (overrides = {}) => ({
    'aria-haspopup': 'listbox',
    'aria-expanded': isOpen,
    'aria-controls': menuId,
    onClick: (e) => {
      toggle()
      overrides.onClick?.(e)
    },
    ...overrides,
  })

  const getMenuProps = (overrides = {}) => ({
    id: menuId,
    role: 'listbox',
    'aria-label': 'Dropdown menu',
    ...overrides,
  })

  const getItemProps = (index, overrides = {}) => ({
    role: 'option',
    'aria-selected': selectedIndex === index,
    onClick: (e) => {
      select(index)
      overrides.onClick?.(e)
    },
    ...overrides,
  })

  return {
    isOpen,
    selectedIndex,
    selectedItem: selectedIndex >= 0 ? items[selectedIndex] : null,
    getToggleProps,
    getMenuProps,
    getItemProps,
    close,
  }
}

function DropdownExample() {
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']
  const {
    isOpen,
    selectedItem,
    getToggleProps,
    getMenuProps,
    getItemProps,
  } = useDropdown({ items })

  return (
    <div className="position-relative d-inline-block">
      <button className="btn btn-outline-primary" {...getToggleProps()}>
        {selectedItem || 'Choose a fruit'} ▾
      </button>

      {isOpen && (
        <ul
          className="list-group position-absolute mt-1 shadow"
          style={{ zIndex: 10, minWidth: 200 }}
          {...getMenuProps()}
        >
          {items.map((item, i) => (
            <li
              key={item}
              className={`list-group-item list-group-item-action ${selectedItem === item ? 'active' : ''}`}
              style={{ cursor: 'pointer' }}
              {...getItemProps(i)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CustomDropdown() {
  const items = ['Red', 'Green', 'Blue', 'Yellow']
  const colors = { Red: '#dc3545', Green: '#198754', Blue: '#0d6efd', Yellow: '#ffc107' }
  const {
    isOpen,
    selectedItem,
    getToggleProps,
    getMenuProps,
    getItemProps,
  } = useDropdown({ items })

  return (
    <div className="position-relative d-inline-block">
      <button
        className="btn btn-dark"
        {...getToggleProps()}
        style={selectedItem ? { backgroundColor: colors[selectedItem], borderColor: colors[selectedItem] } : {}}
      >
        {selectedItem || 'Pick a color'} ▾
      </button>

      {isOpen && (
        <ul
          className="list-group position-absolute mt-1 shadow"
          style={{ zIndex: 10, minWidth: 160 }}
          {...getMenuProps()}
        >
          {items.map((item, i) => (
            <li
              key={item}
              className="list-group-item list-group-item-action d-flex align-items-center"
              style={{ cursor: 'pointer' }}
              {...getItemProps(i)}
            >
              <span
                className="me-2 rounded-circle d-inline-block"
                style={{ width: 16, height: 16, backgroundColor: colors[item] }}
              />
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function PropGettersDemo() {
  return (
    <div>
      <h2>Prop Getters</h2>
      <p className="lead">
        Return functions from hooks that bundle props — including ARIA attributes — for consumers.
      </p>

      <ul className="mb-4">
        <li>Hook returns <code>getToggleProps()</code>, <code>getMenuProps()</code>, <code>getItemProps(i)</code></li>
        <li>Each getter returns an object of props to spread: <code>{'...getToggleProps()'}</code></li>
        <li>Built-in accessibility: <code>aria-haspopup</code>, <code>aria-expanded</code>, <code>role=&quot;listbox&quot;</code></li>
        <li>Consumers can pass overrides that merge with defaults</li>
        <li>Popularized by Downshift — the gold standard for accessible headless UI</li>
      </ul>

      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Basic Dropdown</div>
            <div className="card-body" style={{ minHeight: 280 }}>
              <DropdownExample />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Color Picker Dropdown</div>
            <div className="card-body" style={{ minHeight: 280 }}>
              <CustomDropdown />
            </div>
          </div>
        </div>
      </div>

      <code className="snippet">{`function useDropdown({ items }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const menuId = useId()

  const getToggleProps = (overrides = {}) => ({
    'aria-haspopup': 'listbox',
    'aria-expanded': isOpen,
    'aria-controls': menuId,
    onClick: (e) => { toggle(); overrides.onClick?.(e) },
    ...overrides,
  })

  const getMenuProps = (overrides = {}) => ({
    id: menuId, role: 'listbox', ...overrides,
  })

  const getItemProps = (index, overrides = {}) => ({
    role: 'option',
    'aria-selected': selectedIndex === index,
    onClick: (e) => { select(index); overrides.onClick?.(e) },
    ...overrides,
  })

  return { isOpen, selectedItem, getToggleProps, getMenuProps, getItemProps }
}`}</code>
    </div>
  )
}
