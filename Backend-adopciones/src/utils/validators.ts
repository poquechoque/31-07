export const validarEmail = (email: string): boolean => {
  const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return regex.test(email);
};

export const validarCI = (ci: string): boolean => {
  const regex = /^[0-9]{6,10}$/;
  return regex.test(ci);
};

export const validarTelefono = (telefono: string): boolean => {
  const regex = /^[0-9]{7,10}$/;
  return regex.test(telefono);
};

export const validarPassword = (password: string): boolean => {
  return password.length >= 6;
};