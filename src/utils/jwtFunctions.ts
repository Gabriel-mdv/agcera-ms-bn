import jwt from 'jsonwebtoken'



export const generateToken = (payload: object) => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '24h' });
}

export const verifyToken = (token: string): object => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as object;
}






