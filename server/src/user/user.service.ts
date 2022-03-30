import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './models/user.model';
import { Model } from 'mongoose'
import * as bcrypt from 'bcrypt';
import { NewUser } from './dto/new.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

    async createUser(user: NewUser): Promise<User> {
        try {
            const saltOrRounds = 10
            const hash = await bcrypt.hash(user.password, saltOrRounds);

            const { password, ...info } = user
            const newUser = new this.userModel({
                ...info,
                password: hash,
                createAt: new Date()
            })
            await newUser.save()
            return newUser

        } catch (error) {
            throw new NotFoundException()
        }
    }

    async validateLogin(username: string, pass: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ username })

            if (!user) {
                throw new Error()
            }

            const isPasswordValid = await bcrypt.compareSync(pass, user.password)
            if (!isPasswordValid) return null
            
            return user

        } catch (error) {
            throw new NotFoundException()
        }
    }

    async getAllUser(): Promise<User[]> {
        try {
            const users = await this.userModel.find({ role: 'customer' }).select({ password: 0 })
            return users

        } catch (error) {
            throw new NotFoundException()
        }
    }

    async getUser(username: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ username })
            if (!user) {
                throw new Error()
            }

            return user

        } catch (error) {
            throw new NotFoundException()
        }
    }

    async getUserByUsername(username: string): Promise<User> {
        try {
            const user = await this.userModel.findOne({ username })
            
            if (!user) {
                throw new Error()
            }

            return user

        } catch (error) {
            throw new NotFoundException()
        }
    }

}
