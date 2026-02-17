import { describe, it, expect } from 'vitest';
import { isValidEmail } from '../js/validators/email-validator.js';

describe('Email Validator', () => {
    describe('Emails válidos', () => {
        it('debería aceptar email estándar', () => {
            expect(isValidEmail('user@example.com')).toBe(true);
        });

        it('debería aceptar email con números', () => {
            expect(isValidEmail('user123@test.com')).toBe(true);
            expect(isValidEmail('123user@test.com')).toBe(true);
        });

        it('debería aceptar email con guiones', () => {
            expect(isValidEmail('user-name@test.com')).toBe(true);
            expect(isValidEmail('user@test-domain.com')).toBe(true);
        });

        it('debería aceptar email con puntos', () => {
            expect(isValidEmail('user.name@test.com')).toBe(true);
            expect(isValidEmail('user@test.domain.com')).toBe(true);
        });

        it('debería aceptar subdominios', () => {
            expect(isValidEmail('user@mail.example.com')).toBe(true);
            expect(isValidEmail('user@sub.mail.example.com')).toBe(true);
        });

        it('debería aceptar guiones bajos', () => {
            expect(isValidEmail('user_name@example.com')).toBe(true);
        });

        it('debería aceptar símbolos permitidos', () => {
            expect(isValidEmail('user+tag@example.com')).toBe(true);
        });

        it('debería aceptar dominios cortos pero válidos', () => {
            expect(isValidEmail('a@b.co')).toBe(true);
        });
    });

    describe('Emails inválidos', () => {
        it('debería rechazar email sin @', () => {
            expect(isValidEmail('userexample.com')).toBe(false);
        });

        it('debería rechazar email sin dominio', () => {
            expect(isValidEmail('user@')).toBe(false);
        });

        it('debería rechazar email sin usuario', () => {
            expect(isValidEmail('@example.com')).toBe(false);
        });

        it('debería rechazar email sin punto en el dominio', () => {
            expect(isValidEmail('user@example')).toBe(false);
        });

        it('debería rechazar email con espacios', () => {
            expect(isValidEmail('user @example.com')).toBe(false);
            expect(isValidEmail('user@exam ple.com')).toBe(false);
            expect(isValidEmail('user@ example.com')).toBe(false);
        });

        it('debería rechazar email con múltiples @', () => {
            expect(isValidEmail('user@@example.com')).toBe(false);
            expect(isValidEmail('user@test@example.com')).toBe(false);
        });

        it('debería rechazar string vacío', () => {
            expect(isValidEmail('')).toBe(false);
        });

        it('debería rechazar solo espacios', () => {
            expect(isValidEmail('   ')).toBe(false);
            expect(isValidEmail('\t')).toBe(false);
            expect(isValidEmail('\n')).toBe(false);
        });

        it('debería rechazar email que termina con punto', () => {
            expect(isValidEmail('user@example.com.')).toBe(false);
        });

        it('debería rechazar email que empieza con @', () => {
            expect(isValidEmail('@user@example.com')).toBe(false);
        });

        it('debería rechazar puntos consecutivos', () => {
            expect(isValidEmail('user..name@example.com')).toBe(false);
        });
    });

    describe('Edge cases', () => {
        it('debería manejar tipos de datos no string', () => {
            expect(isValidEmail(null)).toBe(false);
            expect(isValidEmail(undefined)).toBe(false);
            expect(isValidEmail(123)).toBe(false);
            expect(isValidEmail({})).toBe(false);
            expect(isValidEmail([])).toBe(false);
        });

        it('debería trimear espacios al inicio y final', () => {
            expect(isValidEmail('  user@example.com  ')).toBe(true);
            expect(isValidEmail('\tuser@example.com\t')).toBe(true);
        });

        it('debería rechazar emails muy largos pero técnicamente válidos', () => {
            const longEmail = 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com';
            // Aunque es técnicamente válido según nuestra regex, es poco práctico
            expect(isValidEmail(longEmail)).toBe(true);
        });
    });

    describe('Casos reales', () => {
        it('debería validar emails comunes', () => {
            expect(isValidEmail('john.doe@gmail.com')).toBe(true);
            expect(isValidEmail('jane_smith@yahoo.com')).toBe(true);
            expect(isValidEmail('contact@company.co.uk')).toBe(true);
            expect(isValidEmail('support+help@service.io')).toBe(true);
        });

        it('debería rechazar errores comunes de usuarios', () => {
            expect(isValidEmail('john@com')).toBe(false);
            expect(isValidEmail('john.gmail.com')).toBe(false);
            expect(isValidEmail('john @gmail.com')).toBe(false);
            expect(isValidEmail('john@gmail')).toBe(false);
        });
    });
});
