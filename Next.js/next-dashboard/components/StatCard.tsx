export default function StatCard({
  title,
  value,
  color = "primary",
}: {
  title: string
  value: string | number
  color?: string
}) {
  return (
    <div className={`card text-white bg-${color} mb-3`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <p className="card-text display-6">{value}</p>
      </div>
    </div>
  )
}
