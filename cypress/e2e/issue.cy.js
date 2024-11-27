describe('Pruebas de Creación de Issues desde el Dashboard con Persistencia', () => {
    const apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';
  
    before(() => {
      cy.visit('/login');
      cy.get('#username').type('username2');
      cy.get('#password').type('password1');
      cy.get('[data-testid="login-btn"]').click();
      cy.url().should('include', '/dashboard');
  
      cy.window().then((win) => {
        const token = win.sessionStorage.getItem('loginData');
        Cypress.env('authToken', token);
      });
    });
  
    beforeEach(() => {
      cy.window().then((win) => {
        const authToken = Cypress.env('authToken');
        if (authToken) {
          win.sessionStorage.setItem('loginData', authToken);
        }
      });
    });
  
    it('Debería abrir el modal para crear un nuevo issue', () => {
      cy.get('button').contains('New').click();
      cy.get('.modal-title').should('contain', 'New issue');
    });
  
    it('Debería crear un nuevo issue exitosamente', () => {
      cy.intercept('POST', `${apiUrl}incident`, {
        statusCode: 200,
        body: { message: 'Issue created successfully!' },
      }).as('createIssue');
  
      cy.get('button').contains('New').click();
      cy.get('#issueName').type('Test Issue');
      cy.get('#issueDescription').type('This is a test issue');
      cy.get('button').contains('Save changes').click();
  
      cy.wait('@createIssue');
      cy.get('.toast-body').should('contain', 'Issue created successfully!');
    });
  
    it('Debería mostrar error si los campos están vacíos', () => {
      cy.get('button').contains('New').click();
      cy.get('button').contains('Save changes').click();
      cy.get('.toast-body').should('contain', 'Please fill in all fields before saving.');
    });
  
    it('Debería manejar errores del servidor al crear un issue', () => {
      cy.intercept('POST', `${apiUrl}incident`, {
        statusCode: 500,
        body: { message: 'Failed to create issue' },
      }).as('createIssueError');
  
      cy.get('button').contains('New').click();
      cy.get('#issueName').type('Test Issue');
      cy.get('#issueDescription').type('This is a test issue');
      cy.get('button').contains('Save changes').click();
  
      cy.wait('@createIssueError');
      cy.get('.toast-body').should('contain', 'Failed to create issue.');
    });
  });
  