import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: { username: string; password: string }) {
    // Aquí podrías validar el usuario con una base de datos
    const payload = { username: user.username }; // Ejemplo: usar un ID ficticio
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
