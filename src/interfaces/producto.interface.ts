import { Producto } from 'generated/prisma';
import { RespuestaGenericaObtenerTodo } from './genericas';

export interface RespuestaProducto {
  mensaje: string;
  producto: Producto;
}

export interface RespuestaObtenerProductos
  extends RespuestaGenericaObtenerTodo {
  productos: Producto[];
}
