export default function StatCard({ title, value, color }: any) {

    return (
        <div className="col-md-3">
            <div className={`card text-bg-${color} mb-3`}>
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <h3>{value}</h3>
                </div>
            </div>
        </div>

    )

}