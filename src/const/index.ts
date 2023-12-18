export const TOKEN_STATUS = {
    EXPIRED: 'expired',
    USED: 'used',
}
export const PROCESS_ENV = {
    JWT_SECRET: process.env.JWT_SECRET ?? "secret_",
    NODE_ENV: process.env.NODE_ENV ?? "dev",
    PORT: process.env.PORT ?? "3001"
}
export const NODE_ENV = {
    DEV: "dev",
    PROD: "prod"
}
