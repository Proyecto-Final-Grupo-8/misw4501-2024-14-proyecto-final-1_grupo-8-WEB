describe('Pruebas de Creación de Issues desde el Dashboard con Persistencia', () => {
  const apiUrl = 'https://backend-781163639586.us-central1.run.app/api/';
  let issueId = null;

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
    cy.visit('/#/dashboard');
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
    cy.get('#issueName').should('be.visible');
    cy.get('#issueName').type('Test Issue');
    cy.get('#issueDescription').type('This is a test issue');
    cy.get('button').contains('Save changes').click();

    cy.wait('@createIssue');
    cy.get('.toast-body').should('contain', 'Issue created successfully.');
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
    cy.get('#issueName').should('be.visible');
    cy.get('#issueName').type('Test Issue');
    cy.get('#issueDescription').type('This is a test issue');
    cy.get('button').contains('Save changes').click();

    cy.wait('@createIssueError');
    cy.get('.toast-body').should('contain', 'Failed to create issue.');
  });

  it('Debería navegar al detalle de un issue al hacer clic en "View Detail"', () => {
    cy.get('table tbody tr').should('exist');
    cy.get('table tbody tr').first().within(() => {
      cy.contains('View Detail').click();
    });

    cy.url().should('match', /\/#\/issues\/[a-f0-9\-]{36}$/);

    // Guardar el issueId desde la URL
    cy.url().then((url) => {
      issueId = url.split('/').pop();
    });
  });

  it('Debería agregar un comentario exitosamente', () => {
    const commentText = 'Este es un comentario de prueba.';
  
    // Interceptar la llamada para agregar el comentario
    cy.intercept('POST', `${apiUrl}incident/${issueId}/logs`, {
      statusCode: 200,
      body: { id: 'log123', details: commentText, user_name: 'Test User', created_date: new Date().toISOString() },
    }).as('addComment');
  
    // Interceptar la llamada para refrescar los logs
    cy.intercept('GET', `${apiUrl}incident/${issueId}/logs`, {
      statusCode: 200,
      body: [
        { id: 'log123', details: commentText, user_name: 'Test User', created_date: new Date().toISOString() },
      ],
    }).as('fetchLogs');
  
    // Asegurarse de estar en la página de detalles del issue
    cy.visit(`/#/issues/${issueId}`);
  
    // Agregar comentario
    cy.get('textarea[placeholder="Enter your comment"]').type(commentText);
    cy.get('button').contains('Add Comment').click();
  
    // Esperar a que ambas llamadas terminen
    cy.wait('@addComment');
    cy.wait('@fetchLogs');
  
    // Verificar que el comentario aparece en la lista de comentarios
    cy.get('.comments-container')
      .contains(commentText)
      .should('be.visible');
  });

  it('Debería mostrar error si el campo de comentario está vacío', () => {
    // Asegurarse de estar en la página de detalles del issue
    cy.visit(`/#/issues/${issueId}`);

    cy.get('textarea[placeholder="Enter your comment"]').clear();
    cy.get('button').contains('Add Comment').click();

    // Verificar que se muestra el mensaje de error
    cy.get('.toast-body').should('contain', 'Please enter log details.');
  });

  it('Debería manejar errores del servidor al agregar un comentario', () => {
    cy.intercept('POST', `${apiUrl}incident/${issueId}/logs`, {
      statusCode: 500,
      body: { message: 'Failed to add log' },
    }).as('addCommentError');

    // Asegurarse de estar en la página de detalles del issue
    cy.visit(`/#/issues/${issueId}`);

    // Intentar agregar comentario
    cy.get('textarea[placeholder="Enter your comment"]').type('Este es un comentario que generará error.');
    cy.get('button').contains('Add Comment').click();

    // Verificar que se muestra el mensaje de error del servidor
    cy.wait('@addCommentError');
    cy.get('.toast-body').should('contain', 'Failed to add log.');
  });
});
