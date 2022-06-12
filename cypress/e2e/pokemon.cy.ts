describe('button', () => {
    it('passes', () => {
        cy.visit('http://localhost:3000/pokemon');
        cy.get('nav ul li button').contains('1').click();
        cy.url().should('eq', 'http://localhost:3000/pokemon?page=1');
        cy.get('nav ul li button').contains('38').click();
        cy.url().should('eq', 'http://localhost:3000/pokemon?page=38');
    })

    it('passes', () => {
        cy.visit('http://localhost:3000/pokemon');
        const world = cy.get('form input').type('bulbasaur');
        world.should('have.value', 'bulbasaur');
        cy.get('form button').click();
        cy.get('a[href="/pokemon/1"]>p').should('have.text', 'bulbasaur');
        const links = cy.get('a[href="/pokemon/1"]');
        links.should('have.length', 1);
        links.click();
        cy.wait(10000);
        cy.url().should('eq', 'http://localhost:3000/pokemon/1');
    })
})