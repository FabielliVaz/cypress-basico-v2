/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", function () {
  beforeEach(function () {
    cy.visit("./src/index.html");
  });

  it("verifica o título da aplicação", function () {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("Preenche os campos obrigatórios e envia o formulário", function () {
    const longText =
      "teste, teste 01, teste 02, teste 03, teste 04, teste 05, teste 06, teste 07";
    cy.get("#firstName").type("Fabi");
    cy.get("#lastName").type("Vaz");
    cy.get("#email").type("fabiellivaz@exemplo.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", function () {
    cy.get("#firstName").type("Fabi");
    cy.get("#lastName").type("Vaz");
    cy.get("#email").type("fabiellivaz@exemplo,com");
    cy.get("#open-text-area").type("teste");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });

  it("Campo telefone continua vazio quando não preenchido com valor numérico", function () {
    cy.get("#phone").type("yagbuscgua").should("have.value", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", function () {
    cy.get("#firstName").type("Fabi");
    cy.get("#lastName").type("Vaz");
    cy.get("#email").type("fabiellivaz@exemplo.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("teste");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", function () {
    cy.get("#firstName")
      .type("Fabi")
      .should("have.value", "Fabi")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Vaz")
      .should("have.value", "Vaz")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("fabiellivaz@exemplo.com")
      .should("have.value", "fabiellivaz@exemplo.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("12345789")
      .should("have.value", "12345789")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", function () {
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado", function () {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", function () {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor", function () {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu indíce", function () {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it("marca o tipo de atendimento (Feedback)", function () {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("have.value", "feedback");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"]')
      .should("have.length", 3)
      .each(function ($radio) {
        cy.wrap($radio).check();
        cy.wrap($radio).should("be.checked");
      });
  });
  it("marca ambos checkboxes depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });
  it("seleciona um arquivo da pasta fixture", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json")
      .should(function ($input) {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });
  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .should("not.have.value")
      .selectFile("./cypress/fixtures/example.json", { action: "drag-drop" })
      .should(function ($input) {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });
  it("seleciona um arquivo utilizando uma fixtures para qual foi dada um alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile")
      .should(function ($input) {
        expect($input[0].files[0].name).to.eq("example.json");
      });
  });
  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um click", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });
  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();
    cy.contains("Talking About Testing").should("be.visible");
  });
});
