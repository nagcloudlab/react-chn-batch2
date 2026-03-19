

function renderStars(rating) {
    let stars = []
    for (let i = 0; i < rating; i++) {
        stars.push(<i key={i} className="fa fa-star text-warning"></i>)
    }
    return stars;
}


function Review({ review }) {
    return (
        <div className="card border-0 shadow-sm mb-3 transition">
            <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 className="card-title mb-2">{review.reviewer}</h5>
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-warning">
                                {renderStars(review.rating)}
                            </span>
                            <span className="badge bg-light text-dark fw-normal">{review.rating}/5</span>
                        </div>
                    </div>
                </div>
                <p className="card-text text-muted">{review.comment}</p>
            </div>
        </div>
    )
}

export default Review;