import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './models/product.model';
import { Model } from 'mongoose'
import { NewProductDTO } from './dto/new.dto';
import { unlinkSync } from 'fs'
import { join } from 'path';

@Injectable()
export class ProductService {
    constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) { }

    public async createProduct(newProduct: NewProductDTO, file: Express.Multer.File): Promise<Product> {
        try {
            const product = await this.productModel.create({
                ...newProduct,
                image: '/products/' + file.filename,
                createAt: new Date()
            })
            return await product.save()

        } catch (error) {
            throw new BadRequestException({
                message: "Create failed!"
            })
        }
    }

    public async getShopProducts(cursor: number): Promise<Product[]> {
        try {
            return await this.productModel
                .find()
                .skip(cursor)
                .limit(10)
                .sort({ name: 1 })

        } catch (error) {
            throw new NotFoundException({
                message: 'Get products failed !'
            })
        }
    }

    public async getProductByCategory(category: string | undefined): Promise<Product[]> {
        try {
            if (category && category.length !== 0)
                return await this.productModel
                    .find({ category })
                    .sort({ name: 1 })

            return await this.productModel
                .find()
                .sort({ name: 1 })

        } catch (error) {
            throw new NotFoundException({
                message: 'Get products failed !'
            })
        }
    }

    public async getProductsByName(name: string): Promise<Product[]> {
        try {
            const nameRegex = new RegExp(name, 'i')
            return await this.productModel.find({ name: { $regex: nameRegex } })
        } catch (error) {
            throw new NotFoundException({
                message: 'Get products failed !',
                statusCode: 404
            })
        }
    }

    public async changeStatus(productId: string, status: boolean): Promise<Product> {
        try {
            return await this.productModel.findByIdAndUpdate(productId, { status })

        } catch (error) {
            throw new NotFoundException()
        }
    }

    public async deleteProduct(_id: string): Promise<Product> {
        try {
            const product = await this.productModel.findByIdAndDelete(_id)

            await unlinkSync(join(process.cwd(), 'images',product.image))

            return product

        } catch (error) {
            throw new NotFoundException()
        }
    }

}
