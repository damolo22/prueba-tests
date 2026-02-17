<?php

namespace App\Validators;

/**
 * Validador de formularios del servidor
 */
class FormValidator
{
    /**
     * Valida si la contraseña proporcionada coincide con la secreta
     * 
     * @param string $inputPassword Contraseña proporcionada por el usuario
     * @param string $secretPassword Contraseña secreta esperada
     * @return bool True si coinciden, false en caso contrario
     */
    public function validatePassword(string $inputPassword, string $secretPassword): bool
    {
        if (empty($inputPassword) || empty($secretPassword)) {
            return false;
        }

        return $inputPassword === $secretPassword;
    }

    /**
     * Sanitiza un input para prevenir XSS
     * 
     * @param string $input Input del usuario
     * @return string Input sanitizado
     */
    public function sanitizeInput(string $input): string
    {
        // Eliminar espacios en blanco al inicio y final
        $input = trim($input);

        // Convertir caracteres especiales a entidades HTML
        $input = htmlspecialchars($input, ENT_QUOTES, 'UTF-8');

        return $input;
    }

    /**
     * Valida todos los campos del formulario
     * 
     * @param array $formData Datos del formulario ($_POST)
     * @param string $secretPassword Contraseña secreta
     * @return array ['valid' => bool, 'errors' => array, 'data' => array]
     */
    public function validateForm(array $formData, string $secretPassword): array
    {
        $errors = [];
        $sanitizedData = [];

        // Validar nombre
        if (empty($formData['name'] ?? '')) {
            $errors['name'] = 'El nombre es requerido';
        }
        else {
            $sanitizedData['name'] = $this->sanitizeInput($formData['name']);

            // Validar que no sea solo espacios
            if (empty(trim($formData['name']))) {
                $errors['name'] = 'El nombre no puede estar vacío';
            }
        }

        // Validar email (validación básica del servidor)
        if (empty($formData['email'] ?? '')) {
            $errors['email'] = 'El email es requerido';
        }
        else {
            $email = trim($formData['email']);
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $errors['email'] = 'El email no es válido';
            }
            else {
                $sanitizedData['email'] = $this->sanitizeInput($email);
            }
        }

        // Validar contraseña
        $password = $formData['password'] ?? '';
        if (!$this->validatePassword($password, $secretPassword)) {
            $errors['password'] = 'Contraseña incorrecta';
        }

        // Mensaje (opcional, pero sanitizar si existe)
        if (!empty($formData['message'] ?? '')) {
            $sanitizedData['message'] = $this->sanitizeInput($formData['message']);
        }

        return [
            'valid' => empty($errors),
            'errors' => $errors,
            'data' => $sanitizedData
        ];
    }
}