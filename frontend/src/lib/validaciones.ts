export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function esEmailValido(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export function errorDePassword(password: string): string | null {
  if (password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
  if (password.length > 72) return 'La contraseña no puede superar los 72 caracteres';
  return null;
}
