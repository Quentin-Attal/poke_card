describe('send conctact', () => {
    it('passes', () => {
        cy.visit('https://poke-card-six.vercel.app/contact');
        cy.get('#full-name').type('test');
        cy.get('#email').type('test@example.com');
        cy.get('#message').type('test');
        cy.get('#submit').click();
    })
})