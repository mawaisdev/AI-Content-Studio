/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { AuthResponse } from './types/auth.types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        fullname: dto.fullname,
      },
    });

    return this.signToken(user.id, user.email);
  }


  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
  
    if (!user) {
      await bcrypt.compare(dto.password, '$2b$10$fakehashforsecurity');
      throw new UnauthorizedException('Invalid credentials');
    }
  
    const isCorrectPassword = await bcrypt.compare(dto.password, user.password);
    if (!isCorrectPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
  
    return this.signToken(user.id, user.email);
  }

  private async signToken(
    userId: number,
    email: string,
  ): Promise<AuthResponse> {
    const payload = { 
      sub: userId,
      email,
      iss: 'auth-service',
      iat: Math.floor(Date.now() / 1000)
    };
    
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '1h'
    });
  
    return { accessToken: token };
  }
}
