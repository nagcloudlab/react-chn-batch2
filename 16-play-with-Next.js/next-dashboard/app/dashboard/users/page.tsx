export default function UsersPage() {
    return (
        <div className="container">
            <h2>Users</h2>

            <table className="table table-bordered mt-4">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Name</th>
                        <th>Role</th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <td>101</td>
                        <td>John</td>
                        <td>Developer</td>
                    </tr>

                    <tr>
                        <td>102</td>
                        <td>Sarah</td>
                        <td>Admin</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}