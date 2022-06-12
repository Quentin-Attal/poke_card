describe('check main page', () => {
  it('passes', () => {
    cy.visit('https://poke-card-six.vercel.app/');
    cy.visit('https://poke-card-six.vercel.app/cgu');
    cy.visit('https://poke-card-six.vercel.app/contact');
    cy.visit('https://poke-card-six.vercel.app/pokemon');
    cy.visit('https://poke-card-six.vercel.app/pokemon/1');
  })
})