import { Usuario } from 'generated/prisma';
import { RespuestaGenericaObtenerTodo } from './genericas';

export type UsuarioFinal = Omit<Usuario, 'contrasena' | 'created_at'>;

export interface RespuestaUsuario {
  mensaje: string;
  usuario: UsuarioFinal;
}

export interface LoginUsuario {
  mensaje: string;
  token: string;
}

export interface RespuestaObtenerUsuarios extends RespuestaGenericaObtenerTodo {
  usuarios: UsuarioFinal[];
}

export interface PayloadToken {
  id: string;
  nombre: string;
  rol_id: string;
}
