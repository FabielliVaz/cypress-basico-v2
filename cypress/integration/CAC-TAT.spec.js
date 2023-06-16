/// <reference types="Cypress" />

describe("Central de Atendimento ao Cliente TAT", function () {
  const THREE_SECONDS_IN_MS = 3000;
  beforeEach(function () {
    cy.visit("./src/index.html");
  });

  it("verifica o título da aplicação", () => {
    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
  });

  it("Preenche os campos obrigatórios e envia o formulário", () => {
    const longText = Cypress._.repeat("teste", 30);
    cy.clock();

    cy.get("#firstName").type("Fabi");
    cy.get("#lastName").type("Vaz");
    cy.get("#email").type("fabiellivaz@exemplo.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();

    cy.get(".success").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS);

    cy.get(".success").should("not.be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    cy.clock();
    cy.get("#firstName").type("Fabi");
    cy.get("#lastName").type("Vaz");
    cy.get("#email").type("fabiellivaz@exemplo,com");
    cy.get("#open-text-area").type("teste");
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");

    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  Cypress._.times(2, () => {
    it("Campo telefone continua vazio quando não preenchido com valor numérico", () => {
      cy.get("#phone").type("yagbuscgua").should("have.value", "");
    });
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.clock();
    cy.get("#firstName").type("Fabi");
    cy.get("#lastName").type("Vaz");
    cy.get("#email").type("fabiellivaz@exemplo.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type("teste");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);

    cy.get(".error").should("not.be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
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

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.clock();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
    cy.tick(THREE_SECONDS_IN_MS);
    cy.get(".error").should("not.be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    cy.fillMandatoryFieldsAndSubmit();
    cy.get(".success").should("be.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu indíce", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it("marca o tipo de atendimento (Feedback)", () => {
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

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.get("#privacy a").should("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.get("#privacy a").invoke("removeAttr", "target").click();
    cy.contains("Talking About Testing").should("be.visible");
  });

  it("exibe e esconde as mensagens de sucesso e erro usando o .invoke", () => {
    cy.get(".success")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Mensagem enviada com sucesso.")
      .invoke("hide")
      .should("not.be.visible");
    cy.get(".error")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "Valide os campos obrigatórios!")
      .invoke("hide")
      .should("not.be.visible");
  });

  it("Preenche área de texto usando invoke", () => {
    const longText = Cypress._.repeat("0123456789", 20);

    cy.get("#open-text-area")
      .invoke("val", longText)
      .should("have.value", longText);
  });

  it("faz uma requisição HTTP", () => {
    cy.request(
      "https://cac-tat.s3.eu-central-1.amazonaws.com/index.html"
    ).should(function (response) {
      const { status, statusText, body } = response;
      expect(status).to.equal(200);
      expect(statusText).to.equal("OK");
      expect(body).to.include("CAC TAT");
    });
  });

  it("Desafio encontre o (Gato) escondido", () => {
    cy.get("#cat")
      .should("not.be.visible")
      .invoke("show")
      .should("be.visible")
      .and("contain", "🐈")
      .invoke("hide");
    cy.get("#title").invoke("text", "CAT TAT 🐈 ");
  });
});
