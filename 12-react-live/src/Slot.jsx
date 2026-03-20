

function VegItem(props) {
    return (
        <div style={{ color: 'green' }}>
            <h1>{props.name}</h1>
            <p>{props.price}</p>
        </div>
    )
}
function NonVegItem(props) {
    return (
        <div style={{ color: 'red' }}>
            <h1>{props.name}</h1>
            <p>{props.price}</p>
        </div>
    )
}
function Box({ children }) {
    return (
        <div className="card">
            <div className="card-body">
                <ul className="list-group">
                    {children.map((child, index) => (
                        <li className="list-group-item" key={index}>
                            {child}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}
function NpicCard({ header, footer, children }) {
    return (
        <div className="card">
            <div className="card-header">{header}</div>
            <div className="card-body">
                {children}
            </div>
            <div className="card-footer">
                {footer}
            </div>
        </div>
    )
}

function Slot() {
    return (
        <div>
            <h1>Slot(s) - Childrens </h1>
            <hr />
            <NpicCard header="H" footer="F">
                <p>This is the body of the card.</p>
            </NpicCard>
            <hr />
            <Box>
                <VegItem name="Paneer Butter Masala" price="₹200" />
                <VegItem name="Dal Makhani" price="₹150" />
            </Box>
        </div >
    )
}

export default Slot