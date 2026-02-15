import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdenService } from './orden.service';
import { CreateOrdenDto } from './dto/create-orden.dto';
import { UpdateOrdenDto } from './dto/update-orden.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';

@UseGuards(AuthGuard)
@Controller('orden')
export class OrdenController {
  constructor(private readonly ordenService: OrdenService) {}

  @Post()
  create(@Body() createOrdenDto: CreateOrdenDto) {
    return this.ordenService.create(createOrdenDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.ordenService.findAll(paginationDto);
  }

  @Get('mesa/:id')
  ordenPorMesa(@Param('id') id: string) {
    return this.ordenService.obtenerOrdenPorMesa(id);
  }
  @Get('mesero/:id')
  ordenesPorMesero(
    @Param('id') id: string,
    // @Query() paginationDto: PaginationDto,
  ) {
    // return this.ordenService.obtenerOrdenesPorMesero(id, paginationDto);
    return this.ordenService.obtenerOrdenesPorMesero(id);
  }

  @Patch('preparada/:id')
  ordenPreparada(@ConnectedSocket() socket: Socket, @Param('id') id: string) {
    return this.ordenService.ordenPreparada(socket, id);
  }
  @Patch('entregada/:id')
  ordenEntregada(@Param('id') id: string) {
    return this.ordenService.ordenEntregada(id);
  }
  @Patch('completar-un-pedido/:id')
  completarUnPedidoDeOrden(@Param('id') id: string) {
    return this.ordenService.completarUnPedido(id);
  }
  @Patch('completar-una-entrega/:id')
  completarUnaEntregaDeOrden(@Param('id') id: string) {
    return this.ordenService.entregarUnPedidoMesa(id);
  }

  @Patch('completado/:id')
  completarOrden(@Param('id') id: string) {
    return this.ordenService.completarOrden(id);
  }

  @Get('barra')
  findAllOrdersForBar() {
    return this.ordenService.ordenesParaBarra();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenService.findOne(id);
  }

  // POSIBLEMENTE DEBA REMOVER EL INDEX QUE CREE PARA EL METODO UPDATE
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenDto: UpdateOrdenDto) {
    return this.ordenService.update(id, updateOrdenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenService.remove(id);
  }
}
