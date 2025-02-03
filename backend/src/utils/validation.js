export const validateRegister = (userData) => {
    const { nombre, apellido, email, password, negocio_id } = userData;
    
    // Validaciones básicas
    if (!nombre || nombre.length < 2) {
      throw new Error('Nombre inválido');
    }
  
    if (!apellido || apellido.length < 2) {
      throw new Error('Apellido inválido');
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Correo electrónico inválido');
    }
  
    if (!password || password.length < 6) {
      throw new Error('Contraseña debe tener al menos 6 caracteres');
    }
  
    if (!negocio_id) {
      throw new Error('ID de negocio es requerido');
    }
  };
  
  export const validateLogin = (loginData) => {
    const { email, password, negocio_id } = loginData;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw new Error('Correo electrónico inválido');
    }
  
    if (!password) {
      throw new Error('Contraseña es requerida');
    }
  
    if (!negocio_id) {
      throw new Error('ID de negocio es requerido');
    }
  };