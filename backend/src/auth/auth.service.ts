import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async registro(email: string, password: string) {
    const usuario = await this.usuariosService.crear(email, password);
    const payload = {
      sub: usuario.id,
      email: usuario.email   
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        plan: usuario.plan,
      },
    };
  }

  async login(email: string, password: string) {
    const usuario = await this.usuariosService.buscar_por_email(email);
    if(!usuario) throw new UnauthorizedException('Credenciales incorrectas');

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if(!passwordValido) throw new UnauthorizedException('Credenciales incorrectas');

    const payload = {
      sub: usuario.id,
      email: usuario.email,
    };

    return{
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        email: usuario.email,
        plan: usuario.plan,
      },
    };
  }
}
