import { $Enums, Orden } from 'generated/prisma';
import { RespuestaGenericaObtenerTodo } from './genericas';

export interface RespuestaOrden {
  mensaje: string;
  orden: Orden;
}

export interface RespuestaObtenerOrdenes extends RespuestaGenericaObtenerTodo {
  ordenes: Orden[];
}

export type OrdenBarra = {
  mesero: {
    nombre_usuario: string;
  };
  mesa: {
    nombre: string;
    es_vip: boolean;
  };
  pedidos: {
    cantidad: number;
    comentarios: string | null;
    para_barra: boolean;
    preparado: boolean;
    producto: {
      id: string;
      nombre: string;
    };
  }[];
} & {
  id: string;
  mesero_id: string;
  mesa_id: string;
  estado_orden: $Enums.EstadoOrden;
  total: number | null;
};
