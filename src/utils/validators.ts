export const validators = {
  email: (email: string): boolean => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  },

  ci: (ci: string): boolean => {
    const regex = /^[0-9]{6,10}$/;
    return regex.test(ci);
  },

  telefono: (telefono: string): boolean => {
    const regex = /^[0-9]{7,10}$/;
    return regex.test(telefono);
  },

  password: (password: string): boolean => {
    return password.length >= 6;
  },
};

export const formatearFecha = (fecha: string | Date): string => {
  const date = new Date(fecha);
  return date.toLocaleDateString('es-BO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatearEdad = (meses: number): string => {
  if (meses < 12) {
    return `${meses} ${meses === 1 ? 'mes' : 'meses'}`;
  }
  const anos = Math.floor(meses / 12);
  const restoMeses = meses % 12;
  if (restoMeses === 0) {
    return `${anos} ${anos === 1 ? 'año' : 'años'}`;
  }
  return `${anos} ${anos === 1 ? 'año' : 'años'} y ${restoMeses} ${restoMeses === 1 ? 'mes' : 'meses'}`;
};