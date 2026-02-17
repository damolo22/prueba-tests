<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secure Form Check</title>
    <style>
        body {
            font-family: sans-serif;
            max-width: 600px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .form-group {
            margin-bottom: 1rem;
            position: relative;
        }

        label {
            display: block;
            margin-bottom: .5rem;
        }

        input,
        textarea {
            width: 100%;
            padding: .5rem;
            border: 1px solid #ccc;
        }

        input.valid {
            border-color: #28a745;
            background-color: #f0fff4;
        }

        input.invalid {
            border-color: #dc3545;
            background-color: #fff5f5;
        }

        .email-error {
            color: #dc3545;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
        }

        .email-error.show {
            display: block;
        }

        button {
            padding: .5rem 1rem;
            background: #007bff;
            color: white;
            border: none;
            cursor: pointer;
        }

        button:hover {
            background: #0056b3;
        }

        button:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }

        .success {
            background: #d4edda;
            color: #155724;
            padding: 1rem;
            border: 1px solid #c3e6cb;
        }

        .error {
            background: #f8d7da;
            color: #721c24;
            padding: 1rem;
            border: 1px solid #f5c6cb;
        }
    </style>
</head>

<body>
    <h1>Contact Us (Secure Mode)</h1>

    <?php
$secretPass = getenv('PASSWORD_SECRETA') ?: 'admin';

if ($_SERVER['REQUEST_METHOD'] === 'POST'):
    $userPass = $_POST['password'] ?? '';

    if ($userPass === $secretPass): ?>
    <div class="success" id="success-message">
        <p>✨ Access Granted! Form submitted successfully!</p>
        <p>Welcome, <strong>
                <?php echo htmlspecialchars($_POST['name'] ?? ''); ?>
            </strong></p>
    </div>
    <?php
    else: ?>
    <div class="error" id="error-message">
        <p>Access Denied: Wrong Password.</p>
    </div>
    <?php
    endif;
endif; ?>

    <form method="POST" action="">
        <div class="form-group">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email" name="email" required>
            <div class="email-error" id="email-error">Por favor, introduce un email válido</div>
        </div>

        <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" required placeholder="está en el .env">
        </div>

        <div class="form-group">
            <label for="message">Message:</label>
            <textarea id="message" name="message" rows="5"></textarea>
        </div>

        <button type="submit" id="submit-btn">Send Secure Message</button>
    </form>

    <script type="module">
        // Importar el módulo de validación
        import { isValidEmail } from './js/validators/email-validator.js';

        // Obtener elementos del DOM
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const submitBtn = document.getElementById('submit-btn');
        const form = document.querySelector('form');

        // Función para validar el email y actualizar la UI
        function validateEmail() {
            const emailValue = emailInput.value.trim();
            
            // está vacío
            if (emailValue === '') {
                emailInput.classList.remove('valid', 'invalid');
                emailError.classList.remove('show');
                return false;
            }
            
            // ión del módulo para validar
            if (isValidEmail(emailValue)) {
                emailInput.classList.remove('invalid');
                emailInput.classList.add('valid');
                emailError.classList.remove('show');
                return true;
            } else {
                emailInput.classList.remove('valid');
                emailInput.classList.add('invalid');
                emailError.classList.add('show');
                return false;
            }
        }

        // Validación en tiempo real mientras el usuario escribe
        emailInput.addEventListener('input', validateEmail);

        // Validación al perder el foco
        emailInput.addEventListener('blur', validateEmail);

        // Validación antes de enviar el formulario
        form.addEventListener('submit', function(event) {
             const isValid = validateEmail();
            
   (!isValid && emailInput.value.trim() !== '') {
                event.preventDefault(); // Evitar el envío del formulario
                emailInput.focus(); // Poner el foco en el campo email
                return false;
            }
        });
    </script>
</body>

</html>