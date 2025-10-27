export declare class LoginRequestDto {
    email: string;
    password: string;
}
export declare class LoginResponseDto {
    access_token: string;
    user: {
        id: number;
        name: string;
        email: string;
        sector: string;
        role: string;
    };
}
