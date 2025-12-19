import bcrypt from 'bcryptjs';
import { profileRepository } from '../repositories/profile_repository.js';
import { ConflictError, AuthenticationError } from '../utils/app_error.js';

const SALT_ROUNDS = 10;

export const authService = {
  async register({ email, password }) {
    const existingUser = await profileRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError('Email đã được sử dụng');
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await profileRepository.create({
      email,
      passwordHash,
    });

    return {
      id: user.id,
      email: user.email,
      message: 'Đăng ký thành công',
    };
  },

  async login({ email, password }) {
    const user = await profileRepository.findByEmail(email);

    if (!user) {
      throw new AuthenticationError('Email hoặc mật khẩu không đúng');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      throw new AuthenticationError('Email hoặc mật khẩu không đúng');
    }

    return {
      id: user.id,
      email: user.email,
      display_name: user.display_name,
    };
  },
};

