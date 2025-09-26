import { Mesa } from 'generated/prisma';
import { RespuestaGenericaObtenerTodo } from './genericas';

export interface RespuestaMesa {
  mensaje: string;
  mesa: Mesa;
}

export interface RespuestaObtenerTodasLasMesas
  extends RespuestaGenericaObtenerTodo {
  mesas: Mesa[];
}
