import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../dtos/login.dto';
import { IAuthRepository, AUTH_REPOSITORY } from '../../domain/interfaces/auth.repository.interface';
import { TokenService } from '../services/token.service';
import { LoginResponse } from './auth.responses';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async execute(dto: LoginDto): Promise<LoginResponse> {
    const user = await this.authRepository.findByEmailWithPassword(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const accessToken = await this.tokenService.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.tokenService.generateRefreshToken(user.id);
    
    await this.authRepository.saveRefreshToken({
      tokenHash: this.tokenService.hashToken(refreshToken),
      userId: user.id,
      expiresAt: this.tokenService.getRefreshTokenExpiry(),
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, accessToken, refreshToken };
  }
}
