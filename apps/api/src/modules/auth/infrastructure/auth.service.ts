import { Injectable, UnauthorizedException, Logger, Inject } from '@nestjs/common';
import { RegisterUseCase } from '../application/use-cases/register.use-case';
import { LoginUseCase } from '../application/use-cases/login.use-case';
import { RegisterDto, LoginDto } from '../application/dtos';
import { IAuthRepository, AUTH_REPOSITORY, UserData } from '../domain/interfaces/auth.repository.interface';
import { TokenService } from '../application/services/token.service';

export interface AuthTokensResponse {
  user: UserData;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly tokenService: TokenService,
    @Inject(AUTH_REPOSITORY)
    private readonly authRepository: IAuthRepository,
  ) {}

  async register(dto: RegisterDto): Promise<AuthTokensResponse> {
    this.logger.log(`Intento de registro: ${dto.email}`);
    return this.registerUseCase.execute(dto);
  }

  async login(dto: LoginDto): Promise<AuthTokensResponse> {
    this.logger.log(`Intento de login: ${dto.email}`);
    return this.loginUseCase.execute(dto);
  }

  async validateUser(email: string, password: string): Promise<UserData | null> {
    try {
      const result = await this.loginUseCase.execute({ email, password });
      return result.user;
    } catch (error) {
      if (error instanceof UnauthorizedException) return null;
      throw error;
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokensResponse> {
    let payload;
    try {
      payload = await this.tokenService.verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
    if (payload.type !== 'refresh') throw new UnauthorizedException('Token de tipo incorrecto');

    const tokenHash = this.tokenService.hashToken(refreshToken);
    const storedToken = await this.authRepository.findRefreshToken(tokenHash);
    if (!storedToken) throw new UnauthorizedException('Refresh token revocado');
    if (new Date() > storedToken.expiresAt) {
      await this.authRepository.deleteRefreshToken(tokenHash);
      throw new UnauthorizedException('Refresh token expirado');
    }

    await this.authRepository.deleteRefreshToken(tokenHash);
    const user = await this.authRepository.findById(payload.sub);
    if (!user || !user.isActive) throw new UnauthorizedException('Usuario no encontrado o inactivo');

    const newAccessToken = await this.tokenService.generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = await this.tokenService.generateRefreshToken(user.id);
    
    await this.authRepository.saveRefreshToken({
      tokenHash: this.tokenService.hashToken(newRefreshToken),
      userId: user.id,
      expiresAt: this.tokenService.getRefreshTokenExpiry(),
    });

    return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await this.authRepository.deleteRefreshToken(this.tokenService.hashToken(refreshToken));
    } catch (error) { /* idempotente */ }
  }

  async logoutAll(userId: string): Promise<void> {
    await this.authRepository.deleteAllUserRefreshTokens(userId);
  }

  async getProfile(userId: string): Promise<UserData> {
    const user = await this.authRepository.findById(userId);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');
    return user;
  }
}
