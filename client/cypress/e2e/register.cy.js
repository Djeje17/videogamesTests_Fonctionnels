describe('Page d\'inscription (Register)', () => {
  
  beforeEach(() => {
  
    cy.visit('/register');
  });

  it('devrait afficher tous les champs du formulaire', () => {
    cy.get('h3').should('contain', 'Créez un compte');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
    cy.get('input[name="confirmPassword"]').should('be.visible');
    cy.get('button[type="submit"]').should('contain', 'S\'inscrire');
  });

  it('devrait afficher une erreur si les mots de passe ne correspondent pas', () => {
    cy.get('input[name="username"]').type('Testeur');
    cy.get('input[name="email"]').type('test@test.com');
    cy.get('input[name="password"]').type('Password123');
    cy.get('input[name="confirmPassword"]').type('Password456'); // Différent
    
    cy.get('button[type="submit"]').click();

    cy.get('.error-message')
      .should('be.visible')
      .and('contain', 'Les mots de passe ne correspondent pas.');
  });

  it('devrait réussir l\'inscription et rediriger vers la connexion', () => {
    // On simule une réponse positive du serveur 
    cy.intercept('POST', 'http://localhost:3310/api/users', {
      statusCode: 201,
      body: { message: 'Utilisateur créé' },
    }).as('registerRequest');

    cy.get('input[name="username"]').type('jeje');
    cy.get('input[name="email"]').type('jeje@test.fr');
    cy.get('input[name="password"]').type('monpassword');
    cy.get('input[name="confirmPassword"]').type('monpassword');

    cy.get('button[type="submit"]').click();

    // Vérifie que l'appel API a bien été envoyé
    cy.wait('@registerRequest');

    // Vérifie le message de succès
    cy.get('.error-message').should('contain', 'Inscription réussie');

    // Vérifie la redirection après le délai de 2 secondes
    cy.url({ timeout: 5000 }).should('include', '/connection');
  });
});