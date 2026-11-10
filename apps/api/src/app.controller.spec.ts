import { AppController } from './app.controller';
import { AppService } from './app.service';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(() => {
    // Creamos el service manualmente (sin inyección de NestJS)
    appService = new AppService();
    
    // Creamos el controller pasándole el service manualmente
    appController = new AppController(appService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
    });

    it('should have appService injected', () => {
      expect(appService).toBeDefined();
    });

    it('should return "Hello World!"', () => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
    });
  });
});
