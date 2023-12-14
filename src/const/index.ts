export const TOKEN_STATUS = {
    EXPIRED: 'expired',
    USED: 'used',
}
export const PROCESS_ENV = {
    JWT_SECRET: process.env.JWT_SECRET ?? "secret_"
}
