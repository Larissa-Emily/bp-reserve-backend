import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ReserveEntity } from '../../reserve/interface/reserve.entity';

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn('rowid')
    id!: number;
    @Column({ name: 'name', nullable: false })
    name!: string;
    @Column({ name: 'sector', nullable: false })
    sector!: string;
    @Column({ name: 'function', nullable: false })
    functionUser!: string;
    @Column({ name: 'phone', nullable: false })
    phone!: string;
    @Column({ name: 'email', nullable: false })
    email!: string;
    @Column({ name: 'password', nullable: false })
    password!: string;
    @Column({ name: 'role', nullable: false })
    role!: string;
    @Column({ default: 0 })
    failed_attempts!: number;
    @Column({ type: 'timestamptz', nullable: true })
    lock_until!: Date | null;
    @OneToMany(() => ReserveEntity, reservation => reservation.user)
    reservations!: ReserveEntity[];
}