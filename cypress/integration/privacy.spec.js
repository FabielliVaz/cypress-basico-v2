it("testa a página da políyica de privacidade de forma independente", () => {
  cy.visit("./src/privacy.html");

  cy.contains("Talking About Testing").should("be.visible");
});
