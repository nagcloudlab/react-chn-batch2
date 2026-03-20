export default function ActivitySlot() {
  const activities = [
    "New course added",
    "User registered",
    "Course updated",
    "Assignment submitted",
  ]

  return (
    <div className="card">
      <div className="card-body">
        <h6 className="card-title">Recent Activity</h6>
        <ul className="list-unstyled mb-0">
          {activities.map((a, i) => (
            <li key={i} className="py-1 border-bottom">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
