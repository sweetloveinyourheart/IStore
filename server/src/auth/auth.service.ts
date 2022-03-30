import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userService: UserService
    ) { }

    private adminUser = {
        username: 'istore',
        password: 'istore@2022',
        role: 'admin'
    }

    async validateUser(username: string, pass: string): Promise<any> {
        const validatedUser = await this.userService.validateLogin(username, pass)
        
        if (validatedUser) {
            return validatedUser
        }
        
        return null;
    }

    async login(user: any) {
        const payload = { username: user.username, sub: "tynxcodejs", role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            role: user.role
        };
    }

    async validateToken(user: any): Promise<any> {
        return user
    }

}