describe('Page de Profil (User)', () => {
  
  beforeEach(() => {
    // 1. On intercepte l'appel que le "userLoader" fait au démarrage (dans App.tsx)
    // Le loader de root appelle http://localhost:3310/api/me
    cy.intercept('GET', 'http://localhost:3310/api/me', {
      statusCode: 200,
      body: {
        username: 'jeje',
        email: 'jeje@test.fr',
        created_at: '2024-03-20T10:00:00.000Z'
      },
    }).as('getUser');

    // 2. On visite la page de profil
    cy.visit('/profile');
    
    // On attend que le loader ait fini de récupérer les données
    cy.wait('@getUser');
  });

  it('devrait afficher les informations de l\'utilisateur connecté', () => {
    // Vérifie le titre
    cy.get('h2').should('contain', 'Mon Profil');

    // Vérifie le message de bienvenue
    cy.contains('Bonjour jeje').should('be.visible');

    // Vérifie l'email
    cy.contains('Email : jeje@test.fr').should('be.visible');

    // Vérifie que la date est formatée correctement (toLocaleDateString)
    cy.get('.user-card-item').should('contain', 'Membre depuis le :');
  });

  it('devrait afficher un message si l\'utilisateur n\'est pas connecté', () => {
    // On simule une session vide (utilisateur non connecté)
    cy.intercept('GET', 'http://localhost:3310/api/me', {
      statusCode: 401,
      body: null,
    }).as('getNoUser');

    cy.visit('/profile');
    cy.wait('@getNoUser');

    // Vérifie le message de secours défini dans ton composant
    cy.contains('Aucune donnée utilisateur').should('be.visible');
  });
  it('devrait déconnecter l\'utilisateur et rediriger vers l\'accueil', () => {
  // 1. On intercepte l'appel de déconnexion que fait le bouton
  cy.intercept('POST', 'http://localhost:3310/api/logout', {
    statusCode: 200,
    body: { message: "Déconnecté" }
  }).as('postLogout');

  // 2. On simule que l'appel suivant à /api/me renverra une erreur 401 
  // (puisqu'on est censé être déconnecté)
  cy.intercept('GET', 'http://localhost:3310/api/me', {
    statusCode: 401,
    body: null
  }).as('getNoUser');

  // 3. On clique sur le bouton de déconnexion
  // On utilise cy.contains car c'est un bouton avec du texte
  cy.contains('button', 'Déconnexion').click();

  // 4. On attend que l'appel API de déconnexion soit passé
  cy.wait('@postLogout');

  // 5. On vérifie que l'utilisateur est redirigé vers l'accueil
  cy.url().should('eq', Cypress.config().baseUrl + '/');

  // 6. On vérifie que le Header a changé : le bouton "Login" doit être revenu
  cy.contains('Login').should('be.visible');
  cy.contains('Déconnexion').should('not.exist');
});
});