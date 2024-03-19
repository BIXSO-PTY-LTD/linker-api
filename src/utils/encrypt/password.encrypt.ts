import * as bcrypt from 'bcrypt';

export class PasswordEncrypt {
    public static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        return passwordHash;
    }

    public static async comparePassword(password: string, hashPassword?: string): Promise<boolean> {
        if (!hashPassword) return false;

        const isMatch = await bcrypt.compare(password, hashPassword);

        return !!isMatch;
    }
}
