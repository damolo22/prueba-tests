<?php

use PHPUnit\Framework\TestCase;
use App\Validators\FormValidator;

class FormValidatorTest extends TestCase
{
    private FormValidator $validator;
    private string $secretPassword = 'test_secret_123';

    protected function setUp(): void
    {
        $this->validator = new FormValidator();
    }

    // ============================================
    // Tests de Validación de Contraseña
    // ============================================

    public function testValidatePasswordWithCorrectPassword(): void
    {
        $result = $this->validator->validatePassword('test_secret_123', $this->secretPassword);
        $this->assertTrue($result, 'Debería aceptar la contraseña correcta');
    }

    public function testValidatePasswordWithIncorrectPassword(): void
    {
        $result = $this->validator->validatePassword('wrong_password', $this->secretPassword);
        $this->assertFalse($result, 'Debería rechazar contraseña incorrecta');
    }

    public function testValidatePasswordWithEmptyInput(): void
    {
        $result = $this->validator->validatePassword('', $this->secretPassword);
        $this->assertFalse($result, 'Debería rechazar contraseña vacía');
    }

    public function testValidatePasswordWithEmptySecret(): void
    {
        $result = $this->validator->validatePassword('test', '');
        $this->assertFalse($result, 'Debería rechazar cuando la contraseña secreta está vacía');
    }

    public function testValidatePasswordIsCaseSensitive(): void
    {
        $result = $this->validator->validatePassword('TEST_SECRET_123', $this->secretPassword);
        $this->assertFalse($result, 'La validación debe ser case-sensitive');
    }

    // ============================================
    // Tests de Sanitización
    // ============================================

    public function testSanitizeInputRemovesScriptTags(): void
    {
        $input = '<script>alert("XSS")</script>';
        $result = $this->validator->sanitizeInput($input);
        
        $this->assertStringNotContainsString('<script>', $result, 'Debería escapar tags <script>');
        $this->assertStringContainsString('&lt;script&gt;', $result, 'Debería convertir < y > a entidades HTML');
    }

    public function testSanitizeInputHandlesHtmlEntities(): void
    {
        $input = '<b>Bold text</b>';
        $result = $this->validator->sanitizeInput($input);
        
        $this->assertEquals('&lt;b&gt;Bold text&lt;/b&gt;', $result);
    }

    public function testSanitizeInputTrimsWhitespace(): void
    {
        $input = '  username  ';
        $result = $this->validator->sanitizeInput($input);
        
        $this->assertEquals('username', $result, 'Debería eliminar espacios al inicio y final');
    }

    public function testSanitizeInputHandlesQuotes(): void
    {
        $input = "It's a \"test\"";
        $result = $this->validator->sanitizeInput($input);
        
        $this->assertStringContainsString('&quot;', $result, 'Debería escapar comillas dobles');
        $this->assertStringContainsString('&#039;', $result, 'Debería escapar comillas simples');
    }

    public function testSanitizeInputHandlesSpecialCharacters(): void
    {
        $input = 'User & Co.';
        $result = $this->validator->sanitizeInput($input);
        
        $this->assertStringContainsString('&amp;', $result, 'Debería escapar el símbolo &');
    }

    // ============================================
    // Tests de Validación Completa del Formulario
    // ============================================

    public function testValidateFormWithValidData(): void
    {
        $formData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'test_secret_123',
            'message' => 'Hello world'
        ];

        $result = $this->validator->validateForm($formData, $this->secretPassword);

        $this->assertTrue($result['valid'], 'El formulario debería ser válido');
        $this->assertEmpty($result['errors'], 'No debería haber errores');
        $this->assertEquals('John Doe', $result['data']['name']);
        $this->assertEquals('john@example.com', $result['data']['email']);
    }

    public function testValidateFormWithMissingName(): void
    {
        $formData = [
            'email' => 'john@example.com',
            'password' => 'test_secret_123'
        ];

        $result = $this->validator->validateForm($formData, $this->secretPassword);

        $this->assertFalse($result['valid']);
        $this->assertArrayHasKey('name', $result['errors']);
    }

    public function testValidateFormWithInvalidEmail(): void
    {
        $formData = [
            'name' => 'John Doe',
            'email' => 'invalid-email',
            'password' => 'test_secret_123'
        ];

        $result = $this->validator->validateForm($formData, $this->secretPassword);

        $this->assertFalse($result['valid']);
        $this->assertArrayHasKey('email', $result['errors']);
    }

    public function testValidateFormWithWrongPassword(): void
    {
        $formData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'wrong_password'
        ];

        $result = $this->validator->validateForm($formData, $this->secretPassword);

        $this->assertFalse($result['valid']);
        $this->assertArrayHasKey('password', $result['errors']);
    }

    public function testValidateFormSanitizesXSSInName(): void
    {
        $formData = [
            'name' => '<script>alert("XSS")</script>',
            'email' => 'john@example.com',
            'password' => 'test_secret_123'
        ];

        $result = $this->validator->validateForm($formData, $this->secretPassword);

        $this->assertTrue($result['valid']);
        $this->assertStringNotContainsString('<script>', $result['data']['name']);
        $this->assertStringContainsString('&lt;script&gt;', $result['data']['name']);
    }

    public function testValidateFormWithOnlySpacesInName(): void
    {
        $formData = [
            'name' => '   ',
            'email' => 'john@example.com',
            'password' => 'test_secret_123'
        ];

        $result = $this->validator->validateForm($formData, $this->secretPassword);

        $this->assertFalse($result['valid']);
        $this->assertArrayHasKey('name', $result['errors']);
    }

    public function testValidateFormWithOptionalMessage(): void
    {
        $formData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'test_secret_123',
            'message' => 'This is a test message'
        ];

        $result = $this->validator->validateForm($formData, $this->secretPassword);

        $this->assertTrue($result['valid']);
        $this->assertEquals('This is a test message', $result['data']['message']);
    }

    public function testValidateFormWithoutOptionalMessage(): void
    {
        $formData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'test_secret_123'
        ];

        $result = $this->validator->validateForm($formData, $this->secretPassword);

        $this->assertTrue($result['valid']);
        $this->assertArrayNotHasKey('message', $result['data']);
    }
}
