describe('check main page', () => {
  it('passes', () => {
    cy.visit('http://localhost:3000/');
    cy.visit('http://localhost:3000/cgu');
    cy.visit('http://localhost:3000/contact');
    cy.visit('http://localhost:3000/pokemon');
    cy.visit('http://localhost:3000/pokemon/1');
  })
})