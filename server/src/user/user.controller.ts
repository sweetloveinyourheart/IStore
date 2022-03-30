import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { NewUser } from './dto/new.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('getAE/:username')
  @UseGuards(JwtAuthGuard)
  async getUserAE(@Param('username') username: string) {
    return await this.userService.getUser(username)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return await this.userService.getUserByUsername(req.user.username)
  }

  @UseGuards(JwtAuthGuard)
  @Get('getAll')
  async getUsers() {
    return await this.userService.getAllUser()
  }

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async newUser(@Body() user: NewUser) {
    return await this.userService.createUser(user)
  }

}
