import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user' })
export class UserEntity {
    @PrimaryGeneratedColumn('rowid')
    id: number;
    @Column({ name: 'name', nullable: false })
    name: string;
    @Column({ name: 'sector', nullable: false })
    sector: string;
    @Column({ name: 'email', nullable: false })
    email: string;
    @Column({ name: 'password', nullable: false })
    password: string;
    @Column({ name: 'role', nullable: false })
    role: string
}