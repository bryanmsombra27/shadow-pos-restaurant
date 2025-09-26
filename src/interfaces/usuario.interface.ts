import { Usuario } from 'generated/prisma';
import { RespuestaGenericaObtenerTodo } from './genericas';

export type UsuarioFinal = Omit<Usuario, 'contrasena'>;

export interface RespuestaUsuario {
  mensaje: string;
  usuario: UsuarioFinal;
}

export interface RespuestaObtenerUsuarios extends RespuestaGenericaObtenerTodo {
  usuarios: UsuarioFinal[];
}
