import { ReserveEntity } from '../../reserve/interface/reserve.entity';
export declare class UserEntity {
    id: number;
    name: string;
    sector: string;
    email: string;
    password: string;
    role: string;
    reservations: ReserveEntity[];
}
