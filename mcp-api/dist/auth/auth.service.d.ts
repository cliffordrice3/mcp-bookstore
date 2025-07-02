import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private jwt;
    constructor(jwt: JwtService);
    login({ username, password }: {
        username: string;
        password: string;
    }): Promise<{
        access_token: string;
    }>;
}
