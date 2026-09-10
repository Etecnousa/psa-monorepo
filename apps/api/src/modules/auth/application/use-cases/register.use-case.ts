import { Injectable, ConflictException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dtos/register.dto';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/interfaces/auth.repository.interface';
import { TokenService } from '../services/token.service';
import { RegisterResponse } from './auth.responses';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: RegisterDto): Promise<RegisterResponse> {
    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.authRepository.create({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    const accessToken = await this.tokenService.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);
    
    await this.authRepository.saveRefreshToken({
      tokenHash: this.tokenService.hashToken(refreshToken),
      userId: user.id,
      expiresAt: this.tokenService.getRefreshTokenExpiry(),
    });

    return { user, accessToken, refreshToken };
  }
}
