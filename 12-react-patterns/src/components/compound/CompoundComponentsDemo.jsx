import { createContext, useContext, useState } from 'react'

const AccordionContext = createContext()

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (index) => {
    setOpenIndex(prev => (prev === index ? null : index))
  }
  return (
    <AccordionContext.Provider value={{ openIndex, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  )
}

function Item({ children }) {
  return <div className="accordion-item">{children}</div>
}

function Header({ children, index }) {
  const { openIndex, toggle } = useContext(AccordionContext)
  const isOpen = openIndex === index
  return (
    <h2 className="accordion-header">
      <button
        className={`accordion-button ${isOpen ? '' : 'collapsed'}`}
        type="button"
        onClick={() => toggle(index)}
      >
        {children}
      </button>
    </h2>
  )
}

function Body({ children, index }) {
  const { openIndex } = useContext(AccordionContext)
  const isOpen = openIndex === index
  return (
    <div className={`accordion-collapse collapse ${isOpen ? 'show' : ''}`}>
      <div className="accordion-body">{children}</div>
    </div>
  )
}

Accordion.Item = Item
Accordion.Header = Header
Accordion.Body = Body

export default function CompoundComponentsDemo() {
  return (
    <div>
      <h2>Compound Components</h2>
      <p className="lead">
        A set of components that work together, sharing implicit state through Context.
      </p>

      <ul className="mb-4">
        <li>Parent component owns the shared state (which item is open)</li>
        <li>Child components access state via Context — no prop drilling</li>
        <li>Users compose freely: <code>Accordion.Item</code>, <code>.Header</code>, <code>.Body</code></li>
        <li>Think of it like <code>&lt;select&gt;</code> + <code>&lt;option&gt;</code> in HTML</li>
        <li>Great for tabs, accordions, menus, and form groups</li>
      </ul>

      <div className="card mb-4">
        <div className="card-header">Live Demo — Accordion</div>
        <div className="card-body">
          <Accordion>
            <Accordion.Item index={0}>
              <Accordion.Header index={0}>What is React?</Accordion.Header>
              <Accordion.Body index={0}>
                React is a JavaScript library for building user interfaces,
                maintained by Meta. It uses a component-based architecture.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item index={1}>
              <Accordion.Header index={1}>What are Compound Components?</Accordion.Header>
              <Accordion.Body index={1}>
                Compound components share implicit state among a group of
                related components. The parent manages state while children
                consume it via Context.
              </Accordion.Body>
            </Accordion.Item>

            <Accordion.Item index={2}>
              <Accordion.Header index={2}>When should I use this pattern?</Accordion.Header>
              <Accordion.Body index={2}>
                Use compound components when you have a group of components
                that need to share state but should be composed flexibly
                by the consumer.
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>

      <code className="snippet">{`const AccordionContext = createContext()

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null)
  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i)
  return (
    <AccordionContext.Provider value={{ openIndex, toggle }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  )
}

Accordion.Header = function Header({ children, index }) {
  const { openIndex, toggle } = useContext(AccordionContext)
  return <button onClick={() => toggle(index)}>{children}</button>
}

Accordion.Body = function Body({ children, index }) {
  const { openIndex } = useContext(AccordionContext)
  if (openIndex !== index) return null
  return <div>{children}</div>
}`}</code>
    </div>
  )
}
