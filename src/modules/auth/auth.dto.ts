export type createAccount = {
    email: string,
    password: string,
    fullname: string,
    avatarUrl?: string,
    userAgent?: string
}
export interface loginDTOResponse{
    accessToken: string,
    refreshToken: string,
    user: {
        fullname: string,
        email: string,
        createdAt: Date, 
    }
}