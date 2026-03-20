


function Foo(props) {
    return (
        <h1>Foo Component - {props.foo}</h1>
    )
}

function Bar(props) {
    return (
        <h1>Bar Component - {props.bar}</h1>
    )
}


function withCard(Component) {
    return function WrappedComponent(props) {
        return (
            <div className="card">
                <div className="card-header">
                    <h1>{props.header}</h1>
                </div>
                <div className="card-body">
                    <Component {...props} />
                </div>
            </div>
        )
    }
}

const FooWithCard = withCard(Foo);
const BarWithCard = withCard(Bar);

function HOC() {
    return (
        <div>
            <h1>HOC</h1>
            <hr />
            <FooWithCard header="This is Foo" foo="Foo Prop" />
            <hr />
            <BarWithCard header="This is Bar" bar="Bar Prop" />
        </div>
    )
}

export default HOC;