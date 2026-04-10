describe('Page de connexion (Login)', () => {
  
  beforeEach(() => {
    // On visite la page de connexion
    cy.visit('/connection');
  });

  it('devrait afficher le formulaire de connexion', () => {
    cy.get('h3').should('contain', 'Veuillez vous connecter');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'login');
  });

  it('devrait afficher un message d\'erreur en cas de mauvais identifiants', () => {
    // On intercepte l'appel pour simuler une erreur 401 (Unauthorized)
    cy.intercept('POST', 'http://localhost:3310/api/connection', {
      statusCode: 401,
      body: { message: 'Unauthorized' },
    }).as('loginError');

    cy.get('input[name="email"]').type('wrong@test.com');
    cy.get('input[name="password"]').type('mauvaispass');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginError');

    // On vérifie que le message d'erreur s'affiche dans le span
    cy.get('form span')
      .should('be.visible')
      .and('contain', 'Email ou mot de passe incorrect.');
  });

  it('devrait connecter l\'utilisateur et rediriger vers le profil', () => {
    // On simule une réponse positive du serveur
    const mockUser = { username: 'Jeje', id: 1 };
    
    cy.intercept('POST', 'http://localhost:3310/api/connection', {
      statusCode: 200,
      body: mockUser,
    }).as('loginSuccess');

    cy.get('input[name="email"]').type('jeje@test.fr');
    cy.get('input[name="password"]').type('monpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');

    // Cypress va suivre la redirection automatiquement
    cy.url().should('include', '/profile');
  });
});