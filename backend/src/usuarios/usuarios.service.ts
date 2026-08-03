import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async crear(email: string, password: string): Promise<Usuario>{
    const existe = await this.usuariosRepository.findOne({ where: { email } });

    if(existe) throw new ConflictException('El email ya está registrado');

    const password_hash = await bcrypt.hash(password, 10);
    const usuario = this.usuariosRepository.create({ email, password_hash });
    
    return this.usuariosRepository.save(usuario);
  }

  async buscar_por_email(email: string): Promise<Usuario | null>{
    return this.usuariosRepository.findOne({ where: { email } })
  } 

  async buscar_por_id(id: string): Promise<Usuario | null>{
    return this.usuariosRepository.findOne({ where: { id } });
  }

  async guardarUsuario(usuario: Usuario): Promise<Usuario>{
    return this.usuariosRepository.save(usuario);
  }
}
