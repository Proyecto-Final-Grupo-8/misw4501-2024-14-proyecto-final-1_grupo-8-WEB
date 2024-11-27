describe('Pruebas del Registro', () => {
  const apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';

  before(() => {
    // Simula el inicio de sesión guardando el token directamente
    cy.visit('/login');
    cy.get('#username').type('username2'); // Reemplaza con credenciales válidas
    cy.get('#password').type('password1'); // Reemplaza con credenciales válidas
    cy.get('[data-testid="login-btn"]').click();
    cy.url().should('include', '/dashboard'); // Verifica que el login fue exitoso

    cy.window().then((win) => {
      const token = JSON.parse(win.sessionStorage.getItem('loginData'));
      expect(token).to.exist; // Asegúrate de que el token existe
    });
  });

  beforeEach(() => {
    // Visita la página de registro antes de cada prueba
    cy.window().then((win) => {
      win.sessionStorage.setItem(
        'loginData',
        JSON.stringify({ access_token: 'fake-token' })
      );
    });
    cy.visit('#/register');
  });

  it('Debería registrar exitosamente a un usuario', () => {
    cy.intercept('POST', `${apiUrl}register`, {
      statusCode: 200,
      body: { message: 'Registration successful!' },
    }).as('registerUser');

    cy.get('#username').type('testuser');
    cy.get('#name').type('Test');
    cy.get('#last_name').type('User');
    cy.get('#email').type('testuser@example.com');
    cy.get('#phone').type('1234567890');
    cy.get('#role').select('analyst');
    cy.get('#company_id').select('ee5de1ea-df79-4092-b09a-f5352d5dcb73');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Create Account').click();

    cy.wait('@registerUser');
    cy.get('.toast-body').should('contain', 'Registration successful!');
  });

  it('Debería mostrar error si los campos están vacíos', () => {
    cy.get('button').contains('Create Account').click();
    cy.get('.toast-body').should('contain', 'Please fill out all fields!');
  });

  it('Debería mostrar error si las contraseñas no coinciden', () => {
    cy.get('#username').type('testuser');
    cy.get('#name').type('Test');
    cy.get('#last_name').type('User');
    cy.get('#email').type('testuser@example.com');
    cy.get('#phone').type('1234567890');
    cy.get('#role').select('customer');
    cy.get('#company_id').select('ee5de1ea-df79-4092-b09a-f5352d5dcb73');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password1234');
    cy.get('button').contains('Create Account').click();

    cy.get('.toast-body').should('contain', 'Passwords do not match!');
  });

  it('Debería manejar errores del servidor', () => {
    cy.intercept('POST', `${apiUrl}register`, {
      statusCode: 500,
      body: { message: 'Registration failed' },
    }).as('registerUserError');

    cy.get('#username').type('testuser');
    cy.get('#name').type('Test');
    cy.get('#last_name').type('User');
    cy.get('#email').type('testuser@example.com');
    cy.get('#phone').type('1234567890');
    cy.get('#role').select('customer');
    cy.get('#company_id').select('ee5de1ea-df79-4092-b09a-f5352d5dcb73');
    cy.get('#password').type('password123');
    cy.get('#confirmPassword').type('password123');
    cy.get('button').contains('Create Account').click();

    cy.wait('@registerUserError');
    cy.get('.toast-body').should('contain', 'Registration failed! Please try again.');
  });
});
