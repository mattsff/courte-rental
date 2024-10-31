import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface RegisterUserDTO {
  email: string;
  password: string;
  name: string;
}

interface LoginUserDTO {
  email: string;
  password: string;
}

interface UpdateUserDTO {
  name?: string;
  password?: string;
}

export class UserService {
  private users: User[] = [];

  async registerUser(data: RegisterUserDTO) {
    if (this.users.some(user => user.email === data.email)) {
      throw new Error('User already exists');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user: User = {
      id: uuidv4(),
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: 'user',
      createdAt: new Date().toISOString()
    };

    this.users.push(user);

    const token = this.generateToken(user);
    return {
      token,
      user: this.sanitizeUser(user)
    };
  }

  async loginUser(data: LoginUserDTO) {
    const user = this.users.find(user => user.email === data.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    return {
      token,
      user: this.sanitizeUser(user)
    };
  }

  async getCurrentUser(userId: string) {
    const user = this.users.find(user => user.id === userId);
    return user ? this.sanitizeUser(user) : null;
  }

  async updateUser(userId: string, data: UpdateUserDTO) {
    const index = this.users.findIndex(user => user.id === userId);
    if (index === -1) return null;

    const updates: Partial<User> = {};
    if (data.name) updates.name = data.name;
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(data.password, salt);
    }

    this.users[index] = { ...this.users[index], ...updates };
    return this.sanitizeUser(this.users[index]);
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  private sanitizeUser(user: User) {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

export const userService = new UserService();