Cypress.Commands.add("fillMandatoryFieldsAndSubmit", () => {
  cy.get("#firstName").type("Fabi");
  cy.get("#lastName").type("Vaz");
  cy.get("#email").type("fabiellivaz@exemplo.com");
  cy.get("#open-text-area").type("test");
  cy.get('button[type="submit"]').click();
});
