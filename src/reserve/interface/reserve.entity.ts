import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { RoomEntity } from '../../room/interface/room.entity'; // Importa a entidade de Sala
import { UserEntity } from '../../user/interface/user.entity'; // Importa a entidade de Usuário

@Entity('reservations')
export class ReserveEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'date' })
  date!: string;

  @Column({ type: 'varchar', length: 5 }) // HH:MM
  startTime!: string;

  @Column({ type: 'varchar', length: 5 }) // HH:MM
  endTime!: string;

  @Column()
  roomId!: number;

  @ManyToOne(() => RoomEntity, room => room.reservations)
  @JoinColumn({ name: 'roomId' })
  room!: RoomEntity;

  @Column()
  userId!: number;

  @ManyToOne(() => UserEntity, user => user.reservations)
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
