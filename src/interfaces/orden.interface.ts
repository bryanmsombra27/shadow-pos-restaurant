import { Orden } from 'generated/prisma';
import { RespuestaGenericaObtenerTodo } from './genericas';

export interface RespuestaOrden {
  mensaje: string;
  orden: Orden;
}

export interface RespuestaObtenerOrdenes extends RespuestaGenericaObtenerTodo {
  ordenes: Orden[];
}
