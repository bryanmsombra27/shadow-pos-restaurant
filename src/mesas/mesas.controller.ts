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
import { MesasService } from './mesas.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ActualizarEstadoMesaDto } from './dto/actualizar-estado-mesa.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { Socket } from 'socket.io';
import { ConnectedSocket } from '@nestjs/websockets';

@UseGuards(AuthGuard)
@Controller('mesas')
export class MesasController {
  constructor(private readonly mesasService: MesasService) {}

  @Post()
  create(@Body() createMesaDto: CreateMesaDto) {
    return this.mesasService.create(createMesaDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.mesasService.findAll(paginationDto);
  }
  @Get('all')
  todasLasMesas() {
    return this.mesasService.todasLasMesas();
  }

  @Patch('estado')
  actualizarEstadoMesa(
    @ConnectedSocket() socket: Socket,
    @Body() actualizarMesaDto: ActualizarEstadoMesaDto,
  ) {
    return this.mesasService.actualizarEstadoMesa(socket, actualizarMesaDto);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mesasService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMesaDto: UpdateMesaDto) {
    return this.mesasService.update(id, updateMesaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mesasService.remove(id);
  }
}
