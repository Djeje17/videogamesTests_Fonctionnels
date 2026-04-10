describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('http://localhost:3310') // change URL to match your dev URL
  })
})
describe('The Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/')
  })
})
describe('The Home Page', () => {

  beforeEach(() => {
    // On visite la page d'accueil (assure-toi que ton frontend tourne)
    cy.visit('/');
  });

  it('successfully loads', function() {
    // Vérifier que le titre principal est bien affiché
    cy.get('.block-primary-main')
      .should('be.visible')
      .and('contain', 'Vidéogames');

    // Vérifier que les cartes de jeux (fakeGames) sont présentes
    cy.get('.game-card').should('have.length', 3);
  });

  it('displays the correct game information', () => {
    // On vérifie que la première carte contient bien les infos de "Project Nova"
    cy.get('.game-card')
      .first()
      .within(() => {
        cy.get('.game-card-title').should('contain', 'Project Nova');
        cy.get('.game-engine-tag').should('contain', 'Unreal Engine 5');
        cy.get('.status-badge').should('contain', 'En cours');
      });
  });
});