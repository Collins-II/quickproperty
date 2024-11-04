'use client';

import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

interface Review {
    username: string;
    avatar: string;
    rating: number;
    comment: string;
    date: Date;
}

interface PropertyReviewProps {
    reviews: Review[];
}

const PropertyReview: React.FC<PropertyReviewProps> = ({ reviews }) => {
    const [newRating, setNewRating] = useState<number>(0);
    const [hoverRating, setHoverRating] = useState<number>(0);
    const [newComment, setNewComment] = useState<string>('');
    const [reviewList, setReviewList] = useState<Review[]>(reviews);

    const handleRatingClick = (rating: number) => {
        setNewRating(rating);
    };

    const handleMouseEnter = (rating: number) => {
        setHoverRating(rating);
    };

    const handleMouseLeave = () => {
        setHoverRating(0);
    };

    const handleSubmitReview = () => {
        if (newRating > 0 && newComment.length > 0) {
            const newReview: Review = {
                username: 'New User', // Ideally, this should come from authenticated user data
                avatar: '/default-avatar.png', // Default avatar or user avatar URL
                rating: newRating,
                comment: newComment,
                date: new Date(),
            };

            setReviewList([newReview, ...reviewList]);
            setNewRating(0);
            setNewComment('');
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
            <div className="mb-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-2 mb-2">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <FaStar
                                key={i}
                                className={`cursor-pointer ${hoverRating > i || newRating > i ? 'text-yellow-500' : 'text-gray-300'}`}
                                onClick={() => handleRatingClick(i + 1)}
                                onMouseEnter={() => handleMouseEnter(i + 1)}
                                onMouseLeave={handleMouseLeave}
                            />
                        ))}
                </div>
                {/* Review Input */}
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Write your review here..."
                    rows={4}
                />
                {/* Submit Button */}
                <button
                    onClick={handleSubmitReview}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Submit Review
                </button>
            </div>

            {/* Display Reviews */}
            <div className="space-y-6">
                {reviewList.map((review, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <img
                            src={review.avatar}
                            alt={`${review.username}'s avatar`}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">{review.username}</h3>
                                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-1 mb-2">
                                {Array(5)
                                    .fill(0)
                                    .map((_, i) => (
                                        <FaStar key={i} className={`${review.rating > i ? 'text-yellow-500' : 'text-gray-300'}`} />
                                    ))}
                            </div>
                            <p className="text-gray-700">{review.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PropertyReview;
