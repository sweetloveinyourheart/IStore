import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getUsers(accessToken: string, cursor: number) {
    try {
      const users = await lastValueFrom(this.httpService.get(`https://englishleveltest.vn/server/user/students?cursor=${cursor}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": accessToken
        }
      }).pipe(map(resp => resp.data))) 

      return users
    } catch (error) {
      return []
    }
  }
}
