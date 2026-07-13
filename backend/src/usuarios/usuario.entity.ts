
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true})
    email: string;

    @Column()
    password_hash: string;

    @Column({ default: 'gratis '})
    plan: string;

    @CreateDateColumn()
    created_at: Date;
}