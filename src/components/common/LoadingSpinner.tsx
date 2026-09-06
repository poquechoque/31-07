interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  message?: string;
}

export const LoadingSpinner = ({ size = 'medium', message }: LoadingSpinnerProps) => {
  const sizes = {
    small: '1.5rem',
    medium: '3rem',
    large: '5rem',
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div
        style={{
          width: sizes[size],
          height: sizes[size],
          border: '4px solid #e2eaf3',
          borderTop: '4px solid #0b1f3a',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto',
        }}
      />
      {message && <p style={{ marginTop: '1rem', color: '#49627c' }}>{message}</p>}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};