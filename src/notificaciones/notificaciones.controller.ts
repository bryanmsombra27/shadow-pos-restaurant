import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificacionesService } from './notificaciones.service';
import { CreateNotificacioneDto } from './dto/create-notificacione.dto';
import { UpdateNotificacioneDto } from './dto/update-notificacione.dto';
import { AuthGuard } from 'src/guards/auth.guard';
@UseGuards(AuthGuard)
@Controller('notificaciones')
export class NotificacionesController {
  constructor(private readonly notificacionesService: NotificacionesService) {}

  @Post()
  create(@Body() createNotificacioneDto: CreateNotificacioneDto) {
    return this.notificacionesService.create(createNotificacioneDto);
  }

  @Get()
  findAll() {
    return this.notificacionesService.findAll();
  }

  @Get('usuario/:id')
  findOne(@Param('id') id: string) {
    return this.notificacionesService.obtenerNotificacionesPorUsuario(id);
  }

  @Patch('vista/:id')
  notificacionVista(@Param('id') id: string) {
    return this.notificacionesService.notificacionVista(id);
  }
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificacioneDto: UpdateNotificacioneDto,
  ) {
    return this.notificacionesService.update(+id, updateNotificacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificacionesService.remove(+id);
  }
}
