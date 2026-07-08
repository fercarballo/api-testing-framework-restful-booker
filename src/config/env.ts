/**
 * Configuración de ambiente centralizada.
 *
 * La URL de la API y las credenciales se leen de variables de entorno, con un
 * valor por defecto. Así la misma suite puede apuntar a otro ambiente sin tocar
 * código:  API_BASE_URL=https://otra-api.com npm test
 */

export interface EnvConfig {
  baseURL: string;
  username: string;
  password: string;
}

export const ENV: EnvConfig = {
  baseURL: process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com',
  username: process.env.API_USERNAME ?? 'admin',
  password: process.env.API_PASSWORD ?? 'password123',
};
