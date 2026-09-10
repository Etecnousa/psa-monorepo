'use client';

import { useState, useEffect } from 'react';

interface HealthCheck {
  status: 'loading' | 'success' | 'error';
  message: string;
  timestamp?: string;
}

export default function Home() {
  const [health, setHealth] = useState<HealthCheck>({
    status: 'loading',
    message: 'Conectando al backend...',
  });

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:3010/api');
        
        if (response.ok) {
          const data = await response.text();
          setHealth({
            status: 'success',
            message: `Backend responde: "${data}"`,
            timestamp: new Date().toLocaleTimeString(),
          });
        } else {
          setHealth({
            status: 'error',
            message: `Backend respondió con status: ${response.status}`,
            timestamp: new Date().toLocaleTimeString(),
          });
        }
      } catch (error) {
        setHealth({
          status: 'error',
          message: `No se pudo conectar al backend: ${error instanceof Error ? error.message : 'Error desconocido'}`,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    };

    checkBackend();
    
    // Revisar cada 10 segundos
    const interval = setInterval(checkBackend, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      backgroundColor: '#0f172a',
      color: '#e2e8f0',
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
        🎓 PSA - Programa de Seguimiento Académico
      </h1>
      <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>
        Verificación de conexión Frontend → Backend
      </p>

      <div style={{
        padding: '2rem',
        borderRadius: '12px',
        backgroundColor: '#1e293b',
        border: `2px solid ${
          health.status === 'success' ? '#22c55e' : 
          health.status === 'error' ? '#ef4444' : '#eab308'
        }`,
        minWidth: '400px',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {health.status === 'loading' && '⏳'}
          {health.status === 'success' && '✅'}
          {health.status === 'error' && '❌'}
        </div>
        
        <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
          {health.message}
        </p>
        
        {health.timestamp && (
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            Última verificación: {health.timestamp}
          </p>
        )}
      </div>

      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        borderRadius: '8px',
        backgroundColor: '#1e293b',
        minWidth: '400px',
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#94a3b8' }}>
          📋 Estado del Sprint 1
        </h3>
        <ul style={{ listStyle: 'none', padding: 0, lineHeight: '2' }}>
          <li>✅ T1-T9: Base de autenticación creada</li>
          <li>✅ T10: Guards y decoradores RBAC</li>
          <li>⏳ T11: AuthController (próximo paso)</li>
          <li>⏳ T12: AuthModule</li>
          <li>⏳ T13-T14: Tests y pruebas manuales</li>
        </ul>
      </div>

      <p style={{ color: '#475569', marginTop: '2rem', fontSize: '0.8rem' }}>
        Backend: http://localhost:3010 | Frontend: http://localhost:3000
      </p>
    </main>
  );
}
