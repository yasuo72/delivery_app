import React, { useEffect, useState } from 'react';

function ReviewSection({ restaurantId, user, orderId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line
  }, [restaurantId]);

  const fetchReviews = async () => {
    const res = await fetch(`${apiUrl}/reviews/${restaurantId}`);
    const data = await res.json();
    setReviews(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch(`${apiUrl}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        restaurantId,
        orderId,
        rating,
        comment
      })
    });
    if (res.ok) {
      setRating(5);
      setComment('');
      fetchReviews();
    }
    setSubmitting(false);
  };

  return (
    <div style={{ marginTop: 32 }}>
      <h3>Reviews</h3>
      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <label>
          Rating:
          <select value={rating} onChange={e => setRating(Number(e.target.value))} style={{ marginLeft: 8, marginRight: 16 }}>
            {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Write a review..." style={{ width: 220, marginRight: 8, padding: 6 }} />
        <button type="submit" disabled={submitting} style={{ background: '#fc8019', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Submit</button>
      </form>
      {reviews.length === 0 ? <div>No reviews yet.</div> : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {reviews.map(r => (
            <li key={r._id} style={{ borderBottom: '1px solid #eee', marginBottom: 8, paddingBottom: 8 }}>
              <b>{r.user?.name || 'User'}</b>: {r.rating}★ {r.comment && <>- {r.comment}</>}
              <div style={{ fontSize: 12, color: '#888' }}>{new Date(r.createdAt).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReviewSection;
