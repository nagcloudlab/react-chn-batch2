import { use, useEffect, useState } from "react";



function UsersContainer() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    useEffect(() => {
        fetch("https://jsonplaceholder.typicode.com/users")
            .then((response) => response.json())
            .then((data) => setUsers(data));
    }, []);
    return (
        <>
            <div className="row">
                <div className="col-4">
                    <UsersList
                        users={users}
                        onSelect={setSelectedUser}
                        selectedUser={selectedUser} />
                </div>
                <div className="col-8">
                    <UserDetails user={selectedUser} />
                </div>
            </div>
        </>
    )
}

function UsersList({ users, selectedUser, onSelect }) {
    return (
        <div>
            <h2>Users List</h2>
            <ul className="list-group">
                {users.map((user) => (
                    <li key={user.id}
                        style={{
                            cursor: "pointer"
                        }}
                        className={`list-group-item ${selectedUser === user ? "active" : ""}`}
                        onClick={() => onSelect(user)}>
                        {user.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function UserDetails({ user }) {
    return (
        <div>
            <h2>User Details</h2>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
        </div>
    );
}



function ContainerAndPresentational() {
    return (
        <div>
            <h1>Container and Presentational Components</h1>
            <p>
                Container components are responsible for managing state and logic, while presentational components focus on rendering UI based on props. This separation allows for better code organization and reusability.
            </p>
            <hr />
            <UsersContainer />
        </div>
    );
}

export default ContainerAndPresentational;