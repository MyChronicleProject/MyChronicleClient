export interface RefreshToken {
	id: string;
	userId: string;
	token: string;
	expired: string;
	created: string;
	isRevoked: boolean;
}