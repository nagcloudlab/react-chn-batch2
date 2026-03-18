

function renderStars(rating) {
    let stars = []
    for (let i = 0; i < rating; i++) {
        stars.push(<i key={i} style={{
            color: "orange"
        }} className="fa fa-star"></i>)
    }
    return stars;
}


function Review({ review }) {
    return (
        <div className="alert alert-info">
            <h6>{review.reviewer}</h6>
            <p>{review.comment}</p>
            <p>Rating: {renderStars(review.rating)}</p>
        </div>
    )
}

export default Review;