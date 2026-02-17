import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        // Usar jsdom para simular el DOM del navegador
        environment: 'jsdom',

        // Archivos de test a incluir
        include: ['app/tests/**/*.test.js'],

        // Configuración de cobertura
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html'],
            include: ['app/js/**/*.js'],
        },

        // Mostrar output detallado
        reporters: ['verbose'],
    },

    // Configurar alias para imports más limpios
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './app'),
        },
    },
});
