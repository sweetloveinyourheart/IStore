import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseBoolPipe, ParseIntPipe, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { multerOptions } from './config/multer';
import { NewProductDTO } from './dto/new.dto';
import { Product } from './models/product.model';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get('getAll')
  async getProducts(@Query('cursor', new DefaultValuePipe(0), ParseIntPipe) cursor: number): Promise<Product[]> {
    return await this.productService.getShopProducts(cursor)
  }

  @Get('getByCategory')
  async getByCategory(@Query('category') category: string | undefined): Promise<Product[]> {
    return await this.productService.getProductByCategory(category)
  }


  @Get('getByName')
  async getByName(@Query('name') name: string | undefined): Promise<Product[]> {
    return await this.productService.getProductsByName(name)
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async createProduct(@Body() product: NewProductDTO, @UploadedFile() file: Express.Multer.File): Promise<Product> {
    return await this.productService.createProduct(product, file)
  }

  @Put('changeStatus/:id')
  @UseGuards(JwtAuthGuard)
  async changeProductStatus(@Param('id') id: string, @Query("status", new DefaultValuePipe(true), ParseBoolPipe) status: boolean) {
    return await this.productService.changeStatus(id, status)
  }

  @Delete('delete/:id')
  async deleteProduct(@Param('id') id: string) {
    return await this.productService.deleteProduct(id)
  }

}
