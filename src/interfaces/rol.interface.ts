import { Rol } from 'generated/prisma';
import { RespuestaGenericaObtenerTodo } from './genericas';

export interface RespuestaRol {
  mensaje: string;
  rol: Rol;
}

export interface RespuestaObtenerRoles extends RespuestaGenericaObtenerTodo {
  roles: Rol[];
}
