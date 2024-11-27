describe('Pruebas de Inicio de Sesión', () => {
  it('Debería iniciar sesión exitosamente con credenciales válidas', () => {
    cy.visit('/login'); // URL relativa de tu aplicación
    cy.get('#username').type('username2');
    cy.get('#password').type('password1');
    cy.get('[data-testid="login-btn"]').click();
    cy.url().should('include', '/dashboard'); // Verifica la redirección
    cy.contains('Issues');  // Verifica el contenido
  });

  it('Debería mostrar error con credenciales inválidas', () => {
    cy.visit('/login');
    cy.get('#username').type('usuario_invalido');
    cy.get('#password').type('password123');
    cy.get('[data-testid="login-btn"]').click();
    cy.get('.toast-header').should('contain', 'Error'); // Verifica el error
  });
});

