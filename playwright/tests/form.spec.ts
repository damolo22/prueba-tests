import { test, expect } from '@playwright/test';

test('El formulario seguro acepta la contraseña correcta', async ({ page }) => {
  const passwordSecreta = process.env.PASSWORD_SECRETA;
  if (!passwordSecreta) throw new Error('¡Te falta la variable PASSWORD_SECRETA en el .env!');

  await page.goto('/form.php');

  await page.getByLabel('Name:').fill('Hacker Ético');
  await page.getByLabel('Email:').fill('admin@corp.com');

  await page.getByLabel('Password:').fill(passwordSecreta);

  await page.getByLabel('Message:').fill('Probando acceso seguro.');

  await page.getByRole('button', { name: 'Send Secure Message' }).click();

  await expect(page.locator('#error-message')).not.toBeVisible();
  await expect(page.locator('#success-message')).toBeVisible();
});

test('El formulario detecta correctamente una contraseña errónea', async ({ page }) => {
  await page.goto('/form.php');

  // Rellenamos con datos incorrectos
  await page.getByLabel('Name:').fill('Usuario Confundido');
  await page.getByLabel('Email:').fill('fail@corp.com');

  // Usamos una contraseña incorrecta
  await page.getByLabel('Password:').fill('WRONG_PASSWORD');

  await page.getByLabel('Message:').fill('Intentando entrar...');

  await page.getByRole('button', { name: 'Send Secure Message' }).click();

  // AHORA EL TEST PASARÁ (Saldrá en Verde):
  // Porque estamos afirmando que DEBE aparecer un mensaje de error.
  await expect(page.locator('#error-message')).toBeVisible();

  // Opcional: Aseguramos que NO salga el mensaje de éxito
  await expect(page.locator('#success-message')).not.toBeVisible();
});