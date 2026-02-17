import { describe, it, expect, beforeEach, vi } from 'vitest';
import { FormHandler, setupFormValidation } from '../js/form-handler.js';

describe('FormHandler con jsdom', () => {
    let formHTML;

    beforeEach(() => {
        // Crear el HTML del formulario antes de cada test
        formHTML = `
      <form id="myForm">
        <div>
          <label for="name">Name:</label>
          <input type="text" id="name" name="name">
          <span id="name-error" class="error" style="display: none;"></span>
        </div>
        
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" name="email">
          <span id="email-error" class="error" style="display: none;"></span>
        </div>
        
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" name="password">
          <span id="password-error" class="error" style="display: none;"></span>
        </div>
        
        <div>
          <label for="message">Message:</label>
          <textarea id="message" name="message"></textarea>
        </div>
        
        <button type="submit">Submit</button>
      </form>
    `;

        document.body.innerHTML = formHTML;
    });

    describe('Inicialización', () => {
        it('debería crear una instancia de FormHandler', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);

            expect(handler).toBeInstanceOf(FormHandler);
            expect(handler.form).toBe(form);
        });

        it('debería encontrar todos los campos del formulario', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);

            expect(handler.fields.email).toBeTruthy();
            expect(handler.fields.name).toBeTruthy();
            expect(handler.fields.password).toBeTruthy();
            expect(handler.fields.message).toBeTruthy();
        });

        it('debería encontrar todos los elementos de error', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);

            expect(handler.errors.email).toBeTruthy();
            expect(handler.errors.name).toBeTruthy();
            expect(handler.errors.password).toBeTruthy();
        });
    });

    describe('Validación de Email', () => {
        it('debería mostrar error cuando el email es inválido', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');

            emailInput.value = 'invalid-email';
            emailInput.dispatchEvent(new Event('blur'));

            expect(emailError.style.display).toBe('block');
            expect(emailError.textContent).toContain('email válido');
            expect(emailInput.classList.contains('error')).toBe(true);
        });

        it('debería limpiar el error cuando el email es válido', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');

            // Primero ponemos un email inválido
            emailInput.value = 'invalid';
            emailInput.dispatchEvent(new Event('blur'));
            expect(emailError.style.display).toBe('block');

            // Luego corregimos el email
            emailInput.value = 'valid@example.com';
            emailInput.dispatchEvent(new Event('blur'));

            expect(emailError.style.display).toBe('none');
            expect(emailError.textContent).toBe('');
            expect(emailInput.classList.contains('error')).toBe(false);
        });

        it('debería mostrar error cuando el email está vacío', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');

            emailInput.value = '';
            emailInput.dispatchEvent(new Event('blur'));

            expect(emailError.style.display).toBe('block');
            expect(emailError.textContent).toContain('obligatorio');
        });

        it('debería limpiar el error al escribir (input event)', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');

            // Primero creamos un error
            emailInput.value = 'invalid';
            emailInput.dispatchEvent(new Event('blur'));
            expect(emailError.style.display).toBe('block');

            // Luego simulamos que el usuario empieza a escribir
            emailInput.dispatchEvent(new Event('input'));

            expect(emailError.style.display).toBe('none');
        });
    });

    describe('Validación de Nombre', () => {
        it('debería mostrar error cuando el nombre está vacío', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('name-error');

            nameInput.value = '';
            nameInput.dispatchEvent(new Event('blur'));

            expect(nameError.style.display).toBe('block');
            expect(nameError.textContent).toContain('obligatorio');
        });

        it('debería mostrar error cuando el nombre es muy corto', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('name-error');

            nameInput.value = 'A';
            nameInput.dispatchEvent(new Event('blur'));

            expect(nameError.style.display).toBe('block');
            expect(nameError.textContent).toContain('al menos 2 caracteres');
        });

        it('debería aceptar un nombre válido', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('name-error');

            nameInput.value = 'John Doe';
            nameInput.dispatchEvent(new Event('blur'));

            expect(nameError.style.display).toBe('none');
            expect(nameInput.classList.contains('error')).toBe(false);
        });

        it('debería trimear espacios en blanco', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const nameInput = document.getElementById('name');
            const nameError = document.getElementById('name-error');

            nameInput.value = '   ';
            nameInput.dispatchEvent(new Event('blur'));

            expect(nameError.style.display).toBe('block');
            expect(nameError.textContent).toContain('obligatorio');
        });
    });

    describe('Manipulación del DOM', () => {
        it('debería añadir la clase "error" al campo inválido', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');

            emailInput.value = 'invalid';
            handler.validateEmail();

            expect(emailInput.classList.contains('error')).toBe(true);
            expect(emailInput.getAttribute('aria-invalid')).toBe('true');
        });

        it('debería remover la clase "error" cuando el campo es válido', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);

            const emailInput = document.getElementById('email');

            // Primero añadimos el error
            emailInput.value = 'invalid';
            handler.validateEmail();
            expect(emailInput.classList.contains('error')).toBe(true);

            // Luego lo corregimos
            emailInput.value = 'valid@example.com';
            handler.validateEmail();
            expect(emailInput.classList.contains('error')).toBe(false);
            expect(emailInput.hasAttribute('aria-invalid')).toBe(false);
        });

        it('debería añadir la clase "visible" al mensaje de error', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);

            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('email-error');

            emailInput.value = 'invalid';
            handler.validateEmail();

            expect(emailError.classList.contains('visible')).toBe(true);
        });
    });

    describe('Botón de Submit', () => {
        it('debería deshabilitar el botón cuando hay errores', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const submitButton = document.querySelector('button[type="submit"]');

            emailInput.value = 'invalid';
            emailInput.dispatchEvent(new Event('blur'));

            expect(submitButton.disabled).toBe(true);
        });

        it('debería habilitar el botón cuando no hay errores', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const submitButton = document.querySelector('button[type="submit"]');

            expect(submitButton.disabled).toBe(false);
        });
    });

    describe('Submit del Formulario', () => {
        it('debería prevenir el submit si hay errores', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const nameInput = document.getElementById('name');

            emailInput.value = 'invalid';
            nameInput.value = '';

            const submitEvent = new Event('submit', { cancelable: true });
            const result = form.dispatchEvent(submitEvent);

            // El evento debería estar cancelado
            expect(submitEvent.defaultPrevented).toBe(true);
        });

        it('debería permitir el submit si no hay errores', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const nameInput = document.getElementById('name');

            emailInput.value = 'valid@example.com';
            nameInput.value = 'John Doe';

            // Pre-validamos para limpiar errores
            handler.validateEmail();
            handler.validateName();

            const result = handler.handleSubmit({ preventDefault: () => { } });

            expect(result).toBe(true);
        });
    });

    describe('Helper setupFormValidation', () => {
        it('debería inicializar el form handler automáticamente', () => {
            const handler = setupFormValidation('#myForm');

            expect(handler).toBeInstanceOf(FormHandler);
            expect(handler.form).toBeTruthy();
        });

        it('debería devolver null si el formulario no existe', () => {
            const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });

            const handler = setupFormValidation('#nonExistentForm');

            expect(handler).toBeNull();
            expect(consoleSpy).toHaveBeenCalledWith(
                'Form not found: #nonExistentForm'
            );

            consoleSpy.mockRestore();
        });
    });

    describe('Integración completa', () => {
        it('debería validar todo el formulario correctamente', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const nameInput = document.getElementById('name');

            // Caso inválido
            emailInput.value = 'invalid';
            nameInput.value = '';

            expect(handler.validateAll()).toBe(false);

            // Caso válido
            emailInput.value = 'valid@example.com';
            nameInput.value = 'John Doe';

            expect(handler.validateAll()).toBe(true);
        });

        it('debería manejar múltiples errores simultáneos', () => {
            const form = document.getElementById('myForm');
            const handler = new FormHandler(form);
            handler.init();

            const emailInput = document.getElementById('email');
            const nameInput = document.getElementById('name');
            const emailError = document.getElementById('email-error');
            const nameError = document.getElementById('name-error');

            emailInput.value = 'invalid';
            nameInput.value = '';

            handler.validateAll();

            expect(emailError.style.display).toBe('block');
            expect(nameError.style.display).toBe('block');
        });
    });
});
