import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

@Entity('analisis')
export class Analisis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id'})
  usuario: Usuario;

  @Column({type: 'text'})
  resultado: string;

  @CreateDateColumn()
  created_at: Date;
}