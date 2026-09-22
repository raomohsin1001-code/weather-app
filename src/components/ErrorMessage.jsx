export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="state-block state-block--error">
      <p>{message || 'Something went wrong.'}</p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}