describe('use link', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/');
        cy.get('#cgu').click();
        cy.url().should('eq', 'http://localhost:3000/cgu');
        cy.get('#contact').click();
        cy.url().should('eq', 'http://localhost:3000/contact');
        cy.get('#home').click();
        cy.url().should('eq', 'http://localhost:3000/');
    })
    it('passes', () => {
        cy.visit('http://localhost:3000/');
        cy.contains('Go to the pokemon page').click();
        cy.url().should('eq', 'http://localhost:3000/pokemon');
    })
})
