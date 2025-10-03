import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images', // carpeta donde se guardarán
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
    }),
  )
  create(
    @Body() createProductoDto: CreateProductoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.productoService.create(createProductoDto, file);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productoService.findAll(paginationDto);
  }
  @Get('all')
  todosLosProductos() {
    return this.productoService.todosLosProductos();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productoService.update(id, updateProductoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productoService.remove(id);
  }
}
