import { AuthService } from './auth.service';
import { LoginDto } from '../common/dto/login.dto';
export declare class AuthController {
    private auth;
    constructor(auth: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
}
