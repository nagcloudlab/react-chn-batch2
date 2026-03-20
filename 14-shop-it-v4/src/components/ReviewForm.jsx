import { useState, useReducer } from "react";


function formReducer(state, action) {
    switch (action.type) {
        case 'UPDATE_FIELD':
            return {
                ...state,
                [action.field]: action.value
            };
        case 'RESET_FORM':
            return {
                reviewer: '',
                rating: '',
                comment: ''
            };
        default:
            return state;
    }
}

function ReviewForm({ onSubmit }) {

    const [isOpen, setIsOpen] = useState(false);
    const [formData, dispatch] = useReducer(formReducer, {
        reviewer: '',
        rating: '5',
        comment: ''
    });

    const handleInputChange = (e) => {
        dispatch({
            type: 'UPDATE_FIELD',
            field: e.target.name,
            value: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting review:', formData);
        if (onSubmit) {
            onSubmit(formData);
        }
        dispatch({ type: 'RESET_FORM' });
        setIsOpen(false);
    }

    const toggleForm = () => {
        setIsOpen(!isOpen);
    };

    if (!isOpen) {
        return (
            <button onClick={toggleForm} className="open-form-button">
                <i className="fa fa-plus"></i>
            </button>
        );
    }

    return (
        <div className="card">
            <div className="card-header">Review Form</div>
            <div className="card-body">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="reviewerName">Name</label>
                        <input type="text"
                            value={formData.reviewer}
                            className="form-control"
                            name="reviewer"
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="reviewRating">Rating</label>
                        <select className="form-control" name="rating" value={formData.rating} onChange={handleInputChange}>
                            <option value="">Select rating</option>
                            <option value="1">1 - Poor</option>
                            <option value="2">2 - Fair</option>
                            <option value="3">3 - Good</option>
                            <option value="4">4 - Very Good</option>
                            <option value="5">5 - Excellent</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reviewText">Comment</label>
                        <textarea className="form-control" name="comment" rows="3" value={formData.comment} onChange={handleInputChange}></textarea>
                    </div>
                    <hr />
                    <button type="button" className="btn btn-secondary" onClick={toggleForm}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Submit Review</button>
                    <hr />
                </form>
            </div>
        </div>
    )

}

export default ReviewForm;