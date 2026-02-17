import { isValidEmail } from './validators/email-validator.js';

/**
 * Clase para manejar la validación de formularios en tiempo real
 */
export class FormHandler {
    constructor(formElement) {
        this.form = formElement;
        this.fields = {
            email: this.form.querySelector('#email'),
            name: this.form.querySelector('#name'),
            password: this.form.querySelector('#password'),
            message: this.form.querySelector('#message'),
        };
        this.errors = {
            email: this.form.querySelector('#email-error'),
            name: this.form.querySelector('#name-error'),
            password: this.form.querySelector('#password-error'),
        };
        this.submitButton = this.form.querySelector('button[type="submit"]');
    }

    /**
     * Inicializa todos los event listeners del formulario
     */
    init() {
        if (this.fields.email) {
            this.fields.email.addEventListener('blur', () => this.validateEmail());
            this.fields.email.addEventListener('input', () => this.clearError('email'));
        }

        if (this.fields.name) {
            this.fields.name.addEventListener('blur', () => this.validateName());
            this.fields.name.addEventListener('input', () => this.clearError('name'));
        }

        if (this.fields.password) {
            this.fields.password.addEventListener('input', () => this.clearError('password'));
        }

        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    }

    /**
     * Valida el campo de email
     */
    validateEmail() {
        const email = this.fields.email?.value || '';
        const isValid = isValidEmail(email);

        if (!isValid && email.length > 0) {
            this.showError('email', 'Por favor, introduce un email válido');
            return false;
        }

        if (email.length === 0) {
            this.showError('email', 'El email es obligatorio');
            return false;
        }

        this.clearError('email');
        return true;
    }

    /**
     * Valida el campo de nombre
     */
    validateName() {
        const name = this.fields.name?.value?.trim() || '';

        if (name.length === 0) {
            this.showError('name', 'El nombre es obligatorio');
            return false;
        }

        if (name.length < 2) {
            this.showError('name', 'El nombre debe tener al menos 2 caracteres');
            return false;
        }

        this.clearError('name');
        return true;
    }

    /**
     * Muestra un mensaje de error en el campo especificado
     */
    showError(field, message) {
        const errorElement = this.errors[field];
        const fieldElement = this.fields[field];

        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
            errorElement.classList.add('visible');
        }

        if (fieldElement) {
            fieldElement.classList.add('error');
            fieldElement.setAttribute('aria-invalid', 'true');
        }

        this.updateSubmitButton();
    }

    /**
     * Limpia el mensaje de error del campo especificado
     */
    clearError(field) {
        const errorElement = this.errors[field];
        const fieldElement = this.fields[field];

        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
            errorElement.classList.remove('visible');
        }

        if (fieldElement) {
            fieldElement.classList.remove('error');
            fieldElement.removeAttribute('aria-invalid');
        }

        this.updateSubmitButton();
    }

    /**
     * Actualiza el estado del botón de submit según la validez del formulario
     */
    updateSubmitButton() {
        if (!this.submitButton) return;

        const hasVisibleErrors = Object.values(this.errors).some(
            (error) => error && error.style.display === 'block'
        );

        this.submitButton.disabled = hasVisibleErrors;
    }

    /**
     * Maneja el evento de submit del formulario
     */
    handleSubmit(event) {
        event.preventDefault();

        const emailValid = this.validateEmail();
        const nameValid = this.validateName();

        if (emailValid && nameValid) {
            // Formulario válido, se puede procesar
            return true;
        }

        return false;
    }

    /**
     * Valida todo el formulario y devuelve true si es válido
     */
    validateAll() {
        const emailValid = this.validateEmail();
        const nameValid = this.validateName();
        return emailValid && nameValid;
    }
}

/**
 * Función helper para inicializar el FormHandler en un formulario
 */
export function setupFormValidation(formSelector = '#myForm') {
    const form = document.querySelector(formSelector);
    if (!form) {
        console.warn(`Form not found: ${formSelector}`);
        return null;
    }

    const handler = new FormHandler(form);
    handler.init();
    return handler;
}
