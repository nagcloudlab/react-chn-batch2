export default function UsersPage() {
  const users = [
    { id: 1, name: "Admin User", role: "Admin", status: "Active" },
    { id: 2, name: "John Doe", role: "Instructor", status: "Active" },
    { id: 3, name: "Jane Smith", role: "Student", status: "Active" },
    { id: 4, name: "Bob Wilson", role: "Student", status: "Inactive" },
  ]

  return (
    <div>
      <h2 className="mb-4">Users</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <span
                  className={`badge bg-${user.status === "Active" ? "success" : "secondary"}`}
                >
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
