import { Body, Controller, DefaultValuePipe, Delete, Get, Param, ParseIntPipe, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './category.service';
import { multerOptions } from './config/multer';
import { NewCategoryDTO } from './dto/new-category.dto';
import { Category } from './models/category.model';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get('getAll')
  async getShopCategories(
    @Query('cursor', new DefaultValuePipe(0), ParseIntPipe) cursor: number
  ): Promise<Category[]> {
    return await this.categoryService.getShopCategories(cursor)
  }

  @Get('getCategories')
  async getCategories(): Promise<Category[]> {
    return await this.categoryService.getCategories()
  }

  @Post('new')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() category: NewCategoryDTO): Promise<Category> {
    return await this.categoryService.createCategory(category, file)
  }

  @Delete('remove/:id')
  async removeCategory(@Param('id') id: string): Promise<Category> {
    return await this.categoryService.removeShopCategory(id)
  }

}
