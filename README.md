# 🧪 Playwright Testing Project

![Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/tests.yml/badge.svg)

A comprehensive testing project demonstrating **4 types of automated tests** using modern tools:

- 🐘 **PHPUnit** - Backend PHP unit tests
- ⚡ **Vitest** - Frontend JavaScript unit tests
- 🎭 **Vitest + jsdom** - DOM manipulation tests
- 🎬 **Playwright** - End-to-end browser tests

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO

# Setup environment
cp .env.example .env

# Run with Docker
docker-compose up
```

## 🧪 Running Tests

### PHPUnit (Backend PHP Tests)
```bash
cd app/
./vendor/bin/phpunit --testdox
```

**Tests:** Password validation, input sanitization, form validation  
**Duration:** ~15ms | **Tests:** 18 | **Assertions:** 31

---

### Vitest (Frontend JavaScript Tests)
```bash
cd app/
npm test
```

**Tests:** Email validation, DOM manipulation, form handling  
**Duration:** ~1.7s | **Tests:** 46 | **Assertions:** Multiple

---

### Playwright (E2E Tests)
```bash
# From project root
docker-compose up playwright
```

**Tests:** Full user flows in real browser  
**Duration:** ~5-10s | **Tests:** 2

---

## 🤖 Continuous Integration (CI/CD)

This project uses **GitHub Actions** to automatically run all tests on every commit and pull request.

### What happens when you push code:

1. ✅ **PHPUnit** tests run first (fastest)
2. ✅ **Vitest** tests run in parallel
3. ✅ **Playwright** E2E tests run last
4. 📊 **Summary** shows overall results

**See results:** Go to the [Actions tab](https://github.com/YOUR_USERNAME/YOUR_REPO/actions) in GitHub

### Status Badges

- ![PHPUnit](https://img.shields.io/badge/PHPUnit-18%20tests-success)
- ![Vitest](https://img.shields.io/badge/Vitest-46%20tests-success)
- ![Playwright](https://img.shields.io/badge/Playwright-2%20tests-success)

---

## 🔧 Optional: Pre-commit Hook

Run tests **before** committing to catch issues early:

```bash
# Install the hook
cp .githooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

# Now tests run automatically on every commit!
```

To skip the hook (not recommended):
```bash
git commit --no-verify
```

---

## 📊 Test Coverage

| Type | Tool | Coverage |
|------|------|----------|
| **Backend** | PHPUnit | Form validation, password checking, XSS protection |
| **Frontend Logic** | Vitest | Email validation, data transformation |
| **DOM Interaction** | Vitest + jsdom | Real-time validation, error display, button states |
| **User Flows** | Playwright | Complete form submission, success/error messages |

---

## 🏗️ Project Structure

```
.
├── .github/
│   └── workflows/
│       └── tests.yml          # GitHub Actions CI/CD
├── .githooks/
│   └── pre-commit             # Optional local test hook
├── app/
│   ├── js/
│   │   ├── validators/
│   │   │   └── email-validator.js
│   │   └── form-handler.js
│   ├── src/
│   │   └── Validators/
│   │       └── FormValidator.php
│   ├── tests/
│   │   ├── FormValidatorTest.php     # PHPUnit
│   │   ├── email-validator.test.js   # Vitest
│   │   └── form-handler.test.js      # Vitest + jsdom
│   ├── composer.json
│   ├── package.json
│   ├── phpunit.xml
│   └── vitest.config.js
├── playwright/
│   └── tests/
│       ├── form.spec.ts
│       └── edge-cases.spec.ts
└── docker-compose.yml
```

---

## 🎓 What I Learned

This project demonstrates:

- ✅ **Unit Testing** - Testing individual functions in isolation
- ✅ **Integration Testing** - Testing components working together
- ✅ **E2E Testing** - Testing complete user workflows
- ✅ **DOM Testing** - Testing UI interactions without a browser
- ✅ **CI/CD** - Automated testing on every commit
- ✅ **Docker** - Containerized testing environment

---

## 📝 Key Concepts

### The Testing Pyramid
```
        /\
       /E2E\          Few, slow, expensive (Playwright)
      /------\
     /Integr.\       Some tests (jsdom)
    /----------\
   /  Unit Tests \   Many, fast, cheap (PHPUnit + Vitest)
  /--------------\
```

### Why Multiple Test Types?

- **PHPUnit**: Catches backend logic bugs in milliseconds
- **Vitest**: Catches frontend logic bugs without browser overhead
- **jsdom**: Tests DOM manipulation faster than E2E
- **Playwright**: Validates the complete user experience

**Result:** Comprehensive coverage with fast feedback! 🚀

---

## 🔗 Links

- [PHPUnit Documentation](https://phpunit.de/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

## 📄 License

MIT

---

**Built with ❤️ to learn modern testing practices**
