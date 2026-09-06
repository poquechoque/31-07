export const Footer = () => {
  return (
    <footer style={{
      padding: '2rem',
      textAlign: 'center',
      borderTop: '1px solid #e2eaf3',
      color: '#49627c',
      background: '#f8fbff'
    }}>
      <p style={{ margin: 0 }}>
        © {new Date().getFullYear()} adoptaSucre - Sistema de Gestión de Adopciones
      </p>
      <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem' }}>
        Unidad Educativa Técnico Humanístico Don Bosco - Sucre, Bolivia
      </p>
    </footer>
  );
};