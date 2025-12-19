import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { profileRepository } from '../repositories/profile_repository.js';
import { ValidationError, ConflictError, AuthenticationError } from '../utils/app_error.js';
import { env } from '../config/env.js';

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email là bắt buộc');
  }

  const trimmedEmail = email.trim();
  if (!trimmedEmail) {
    throw new ValidationError('Email không được để trống');
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    throw new ValidationError('Email không hợp lệ');
  }

  return trimmedEmail;
};

const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Mật khẩu là bắt buộc');
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new ValidationError(`Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`);
  }

  return password;
};

const validateConfirmPassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new ValidationError('Mật khẩu xác nhận không khớp');
  }
};

export const authService = {
  async register(registerData) {
    const { email, password, confirmPassword } = registerData;

    const validatedEmail = validateEmail(email);
    const validatedPassword = validatePassword(password);
    validateConfirmPassword(validatedPassword, confirmPassword);

    const existingProfile = await profileRepository.findByEmail(validatedEmail);
    if (existingProfile) {
      throw new ConflictError('Email đã được sử dụng');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(validatedPassword, saltRounds);

    const newProfile = await profileRepository.create({
      email: validatedEmail,
      passwordHash,
    });

    return {
      id: newProfile.id,
      email: newProfile.email,
      displayName: newProfile.display_name,
      height: newProfile.height,
      weight: newProfile.weight,
      fullBodyImageUrl: newProfile.full_body_image_url,
      createdAt: newProfile.created_at,
      updatedAt: newProfile.updated_at,
    };
  },

  async login(loginData) {
    const { email, password } = loginData;

    const validatedEmail = validateEmail(email);
    const validatedPassword = validatePassword(password);

    const profile = await profileRepository.findByEmail(validatedEmail);
    
    if (!profile) {
      throw new AuthenticationError('Email hoặc mật khẩu sai');
    }

    const isPasswordValid = await bcrypt.compare(validatedPassword, profile.password_hash);
    
    if (!isPasswordValid) {
      throw new AuthenticationError('Email hoặc mật khẩu sai');
    }

    const tokenPayload = {
      id: profile.id,
      email: profile.email,
    };

    let token;
    try {
      token = jwt.sign(tokenPayload, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn,
      });
    } catch (error) {
      throw new Error('Lỗi hệ thống khi tạo token');
    }

    return {
      token,
      user: {
        id: profile.id,
        email: profile.email,
        displayName: profile.display_name,
        height: profile.height,
        weight: profile.weight,
        fullBodyImageUrl: profile.full_body_image_url,
        createdAt: profile.created_at,
        updatedAt: profile.updated_at,
      },
    };
  },
};

