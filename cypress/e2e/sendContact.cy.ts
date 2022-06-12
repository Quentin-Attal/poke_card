describe('send conctact', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/contact');
        cy.get('#full-name').type('test');
        cy.get('#email').type('test@example.com');
        cy.get('#message').type('test');
        cy.get('#submit').click();
    })
})