export default function NotificationsSlot() {
  return (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title">Notifications</h6>
        <span className="badge bg-danger me-1">3 new</span>
        <ul className="list-unstyled mt-2 mb-0">
          <li className="py-1 border-bottom">Server maintenance tonight</li>
          <li className="py-1 border-bottom">New feature deployed</li>
          <li className="py-1">2 pending reviews</li>
        </ul>
      </div>
    </div>
  )
}
