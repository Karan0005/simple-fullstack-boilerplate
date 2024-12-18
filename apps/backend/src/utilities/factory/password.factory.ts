import * as bcrypt from 'bcrypt';

export const HashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

export const ComparePassword = async (
    password: string,
    hashedPassword: string
): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
};
