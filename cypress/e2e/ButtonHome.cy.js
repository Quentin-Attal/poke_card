describe('use link', () => {
    it('passes', () => {
        cy.visit('https://poke-card-six.vercel.app/');
        cy.get('#cgu').click();
        cy.url().should('eq', 'https://poke-card-six.vercel.app/cgu');
        cy.get('#contact').click();
        cy.url().should('eq', 'https://poke-card-six.vercel.app/contact');
        cy.get('#home').click();
        cy.url().should('eq', 'https://poke-card-six.vercel.app/');
    })
    it('passes', () => {
        cy.visit('https://poke-card-six.vercel.app/');
        cy.contains('Go to the pokemon page').click();
        cy.url().should('eq', 'https://poke-card-six.vercel.app/pokemon');
    })
})
