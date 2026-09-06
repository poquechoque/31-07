interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage = ({ message, onRetry }: ErrorMessageProps) => {
  return (
    <div style={{ textAlign: 'center', padding: '2rem', color: '#a11212' }}>
      <p style={{ fontSize: '1.2rem' }}>❌ {message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="login-button"
          style={{ background: '#0b1f3a', marginTop: '1rem' }}
        >
          Reintentar
        </button>
      )}
    </div>
  );
};