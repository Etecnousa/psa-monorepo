import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './infrastructure/auth.service';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { TokenService } from './application/services/token.service';
import { PrismaAuthRepository } from './infrastructure/repositories/prisma-auth.repository';
import { AUTH_REPOSITORY } from './domain/interfaces/auth.repository.interface';
import { LocalStrategy, JwtStrategy } from './infrastructure/strategies';
import { JwtAuthGuard, RolesGuard } from './infrastructure/guards';
import { PrismaModule } from '../../common/prisma';

@Module({
  imports: [
    ConfigModule, PrismaModule, PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService, LocalStrategy, JwtStrategy, JwtAuthGuard, RolesGuard, TokenService,
    RegisterUseCase, LoginUseCase,
    { provide: AUTH_REPOSITORY, useClass: PrismaAuthRepository },
  ],
  exports: [AuthService],
})
export class AuthModule {}
