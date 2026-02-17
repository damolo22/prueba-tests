  # 🔍 Descubriendo Bugs Inesperados con Testing Exploratorio

## El Problema que Planteaste

> "Lo difícil a la hora de hacer tests no es saber qué está bien o mal, es encontrar esos **errores que no conoces** y no sabes que pueden ocurrir"

¡Exactamente! El verdadero valor del testing es **descubrir problemas antes de que lleguen a producción**.

---

## Los 11 Bugs Sutiles del Formulario

He creado `buggy-form.php` con bugs que NO son obvios a simple vista:

### 🐛 BUG #1: Doble Submit
**Qué es:** El botón no se deshabilita al hacer click, permitiendo múltiples envíos.

**Por qué pasa:** El desarrollador olvidó `submitBtn.disabled = true`

**Cómo lo descubre el test:**
```typescript
await submitBtn.click();
await submitBtn.click(); // Click doble!
await expect(submitBtn).toBeDisabled(); // ❌ FALLA
```

**Impacto real:** ¡El usuario podría registrarse 10 veces si hace click rápido!

---

### 🐛 BUG #2: Espacios en Blanco
**Qué es:** Acepta "     " (solo espacios) como username válido.

**Por qué pasa:** No se usa `.trim()` en el input

**Cómo lo descubre el test:**
```typescript
await page.fill('#username', '     '); // Solo espacios
await page.click('#submit-btn');
// Debería fallar, pero el formulario lo acepta ❌
```

**Impacto real:** Base de datos llena de usernames vacíos.

---

### 🐛 BUG #3: Validación de Edad Inconsistente
**Qué es:** Valida edad < 0, pero NO valida edad > 150 ni decimales.

**Cómo lo descubren los tests:**
```typescript
// Este SÍ lo detecta:
await page.fill('#age', '-5');
await expect(errorMsg).toContainText(/edad/i); // ✅ PASA

// Este NO lo detecta:
await page.fill('#age', '999');
// ❌ El formulario acepta 999 años!

// Este tampoco:
await page.fill('#age', '25.5');
// ❌ Acepta edades decimales!
```

**Impacto real:** Un usuario de 999.5 años en tu base de datos.

---

### 🐛 BUG #4: Sin Límite de Longitud
**Qué es:** No valida la longitud máxima de la biografía.

**Cómo lo descubre el test:**
```typescript
const longBio = 'A'.repeat(10000); // 10,000 caracteres
await page.fill('#bio', longBio);
// ❌ El formulario lo acepta sin problemas
```

**Impacto real:** 
- Problemas de performance en el servidor
- Base de datos sobrecargada
- Posibles ataques DoS

---

### 🐛 BUG #5: Vulnerabilidad XSS
**Qué es:** Muestra el username sin sanitizar usando `innerHTML`.

**Cómo lo descubre el test:**
```typescript
const maliciousUsername = '<script>alert("XSS")</script>';
await page.fill('#username', maliciousUsername);
await page.click('#submit-btn');

const html = await successMsg.innerHTML();
// ❌ Si contiene '<script>', ¡hay XSS!
```

**Impacto real:** 
- Robo de cookies
- Redirección a sitios maliciosos
- Ataques a otros usuarios

---

### 🐛 BUG #6: Formulario No Se Limpia
**Qué es:** Después de submit exitoso, los campos siguen llenos.

**Cómo lo descubre el test:**
```typescript
// Llenar y enviar
await page.fill('#username', 'testuser');
await page.click('#submit-btn');

// Después del éxito, debería estar vacío
await expect(page.locator('#username')).toHaveValue(''); // ❌ FALLA
```

**Impacto real:** UX confusa, el usuario piensa que puede editar el registro.

---

### 🐛 BUG #7: Email Sin Validación Server-Side
**Qué es:** Solo valida email en el cliente (HTML5), pero el backend acepta cualquier cosa.

**Cómo lo descubre el test:**
```typescript
await page.fill('#email', 'not-an-email'); // Sin @
// El HTML5 lo rechaza, pero...

// Si deshabilitamos la validación del cliente:
await page.evaluate(() => {
  document.querySelector('#email').removeAttribute('required');
});
// ❌ El servidor lo acepta!
```

**Impacto real:** Emails inválidos en tu base de datos.

---

### 🐛 BUG #8-9: Sin Protección CSRF ni Sanitización SQL
**Qué es:** El backend acepta datos sin validar.

**Cómo lo descubre el test:**
```typescript
const sqlInjection = "admin' OR '1'='1";
await page.fill('#username', sqlInjection);
// En un sistema vulnerable: ¡SQL Injection exitoso!
```

**Impacto real:** 
- Acceso no autorizado
- Borrado de base de datos
- Robo de información

---

### 🐛 BUG #10: Username Extremadamente Largo
**Qué es:** No hay límite en la longitud del username.

**Cómo lo descubre el test:**
```typescript
const longUsername = 'a'.repeat(10000);
await page.fill('#username', longUsername);
// ❌ Lo acepta sin problemas
```

---

### 🐛 BUG #11: Tipo de Edad Incorrecto
**Qué es:** Si cambias el input type, acepta texto en lugar de números.

**Cómo lo descubre el test:**
```typescript
await page.evaluate(() => {
  document.getElementById('age').type = 'text';
  document.getElementById('age').value = 'veinte';
});
// ❌ Acepta "veinte" como edad!
```

---

## 📊 Resultados de los Tests

Cuando ejecutas:
```bash
docker compose run --rm playwright npx playwright test tests/edge-cases.spec.ts
```

Verás algo como:
```
✘ BUG #1: Detectar doble submit
✘ BUG #2: Espacios en blanco como username válido  
✓ BUG #3: Edad negativa (este SÍ lo detecta)
✘ BUG #3b: Edad imposible (mayor a 150)
✘ BUG #3c: Edad decimal
✘ BUG #4: Biografía extremadamente larga
✘ BUG #5: XSS - Script injection
✘ BUG #6: Formulario no se limpia
... y más
```

---

## 💡 La Lección Clave

### Tests "Happy Path" (lo que ya sabes):
```typescript
test('Formulario funciona con datos válidos', async ({ page }) => {
  await page.fill('#username', 'john');
  await page.fill('#email', 'john@example.com');
  await page.fill('#age', '25');
  await page.click('#submit-btn');
  await expect(successMsg).toBeVisible(); // ✅ PASA
});
```
Este test **NO descubre ningún bug** porque solo prueba el camino feliz.

### Tests Exploratorios (lo que NO sabes):
```typescript
test('¿Qué pasa si...?', async ({ page }) => {
  // ¿Qué pasa si el username solo tiene espacios?
  // ¿Qué pasa si la edad es 999?
  // ¿Qué pasa si inyecto HTML/JS?
  // ¿Qué pasa si pongo 10.000 caracteres?
  // ¿Qué pasa si hago click 5 veces?
});
```
Estos tests **descubren 11 bugs reales**.

---

## 🎯 Cómo Pensar en Edge Cases

Pregúntate siempre:

1. **Límites**: ¿Qué pasa con valores mínimos/máximos?
2. **Tipos**: ¿Qué pasa si el tipo es incorrecto?
3. **Vacío/Null**: ¿Qué pasa con strings vacíos, null, undefined?
4. **Caracteres especiales**: ¿Emojis, HTML, SQL, scripts?
5. **Longitud**: ¿Muy corto, muy largo, extremadamente largo?
6. **Concurrencia**: ¿Doble click, múltiples tabs, race conditions?
7. **Seguridad**: ¿XSS, SQL injection, CSRF?
8. **Performance**: ¿Qué pasa con 10.000 registros?
9. **Usuario malicioso**: ¿Qué haría un hacker?
10. **Usuario torpe**: ¿Qué haría tu abuela?

---

## 🚀 Ejercicio Práctico

1. **Abre el formulario**: http://localhost/buggy-form.php
2. **Juega con él manualmente** - intenta romperlo
3. **Ejecuta los tests**:
   ```bash
   docker compose run --rm playwright npx playwright test tests/edge-cases.spec.ts
   ```
4. **Mira los fallos** - cada fallo es un bug descubierto
5. **Intenta arreglar el formulario** - corrige los bugs
6. **Re-ejecuta los tests** - verifica que los arreglos funcionan

---

## 📚 Conclusión

El testing NO es solo verificar que "funciona". Es:

✅ Descubrir bugs que no sabías que existían  
✅ Pensar como un usuario malicioso  
✅ Pensar como un usuario torpe  
✅ Proteger tu aplicación de lo inesperado  
✅ Dormir tranquilo sabiendo que tu código está sólido  

**Los mejores testers no son los que escriben tests que pasan, son los que escriben tests que fallan y descubren problemas reales.**
