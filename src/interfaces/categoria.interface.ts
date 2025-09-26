import { Categoria } from 'generated/prisma';
import { RespuestaGenericaObtenerTodo } from './genericas';

export interface RespuestaCategoria {
  mensaje: string;
  categoria: Categoria;
}
export interface RespuestaObtenerCategorias
  extends RespuestaGenericaObtenerTodo {
  categorias: Categoria[];
}
