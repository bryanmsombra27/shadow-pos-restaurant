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
  @Patch('completado/:id')
  completarOrden(@Param('id') id: string) {
    return this.ordenService.completarOrden(id);
  }
  @Patch('preparada/:id')
  ordenPreparada(@Param('id') id: string) {
    return this.ordenService.ordenPreparada(id, []);
  }

  @Get('barra')
  findAllOrdersForBar() {
    return this.ordenService.ordenesParaBarra();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenDto: UpdateOrdenDto) {
    return this.ordenService.update(id, updateOrdenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenService.remove(id);
  }
}
