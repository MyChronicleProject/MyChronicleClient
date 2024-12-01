import { AkcessToken } from './AkcessToken';
import { RefreshToken } from './RefreshToken';
export interface User {
    id: string;
    login: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    akcessTokens: AkcessToken[];
    refreshToken: RefreshToken[];
}