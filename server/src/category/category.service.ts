import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewCategoryDTO } from './dto/new-category.dto';
import { Category, CategoryDocument } from './models/category.model';
import { unlinkSync } from 'fs'
import { join } from 'path';

@Injectable()
export class CategoryService {
    constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>) { }

    public async createCategory(category: NewCategoryDTO, file: Express.Multer.File) {
        try {
            const newCategory = new this.categoryModel({
                ...category,
                image: '/categories/' + file.filename
            })
            return await newCategory.save()

        } catch (error) {
            console.log(error);

            throw new BadRequestException()
        }
    }

    public async getShopCategories(cursor: number): Promise<Category[]> {
        try {
            return await this.categoryModel
                .find()
                .skip(cursor)
                .limit(10)
                .sort({ createAt: -1 })

        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async getCategories(): Promise<Category[]> {
        try {
            return await this.categoryModel
                .find()
                .sort({ createAt: -1 })

        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async removeShopCategory(_id: string): Promise<Category> {
        try {
            const cate = await this.categoryModel.findByIdAndRemove(_id)
            await unlinkSync(join(process.cwd(), 'images', cate.image))

            return cate

        } catch (error) {
            console.log(error);
            throw new NotFoundException()
        }
    }
}
