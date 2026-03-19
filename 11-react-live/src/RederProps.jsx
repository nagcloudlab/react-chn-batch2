

function DataTable({ data, renderRow }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Age</th>
                </tr>
            </thead>
            <tbody>
                {data.map((item, index) => renderRow ? renderRow(item) : (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.age}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}


function RenderProps(props) {

    const data = [
        { name: "Alice", age: 30 },
        { name: "Bob", age: 25 },
        { name: "Charlie", age: 35 }
    ];

    return (
        <div>
            <h1>Render Props</h1>
            <hr />
            <DataTable data={data} />

            <DataTable data={data} renderRow={(item) => (
                <tr key={item.name}>
                    <td style={{
                        color: "tomato"
                    }}>{item.name.toUpperCase()}</td>
                    <td>{item.age}</td>
                </tr>
            )} />
        </div>
    )
}

export default RenderProps