export enum Role {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}

export interface Feature {
    name: string;
    description: string;
    enabled: boolean;
    grant: Role[];
    grantAll: boolean;
    grantNone: boolean;
}