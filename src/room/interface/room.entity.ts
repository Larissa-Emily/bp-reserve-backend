import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ReserveEntity } from '../../reserve/interface/reserve.entity'; // Importa a entidade de Reserva

@Entity('rooms')
export class RoomEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  location: string;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
   @OneToMany(() => ReserveEntity, reservation => reservation.room)
  reservations: ReserveEntity[]; // ← ADICIONADO: Relação inversa
}
