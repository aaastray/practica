describe('Приложение', () => {
    beforeEach(() => {
        cy.intercept('GET', 'https://api.example.com/data', {
            statusCode: 200,
            body: [
                { id: 1, title: 'Row 1', x1: 10, x2: 20, x3: 30, x4: 40, x5: 50 },
                { id: 2, title: 'Row 2', x1: 15, x2: 25, x3: 35, x4: 45, x5: 55 },
                { id: 3, title: 'Row 3', x1: 5, x2: 15, x3: 25, x4: 35, x5: 45 }
            ]
        }).as('getData');

        cy.visit('/');
    });

    // Проверка кнопок
    it('должно загружать и отображать данные при клике на кнопку "Получить данные"', () => {
        cy.contains('Получить данные').click();
        cy.wait('@getData');

        cy.get('table').should('exist');
        cy.contains('Row 1').should('exist');
        cy.contains('Row 2').should('exist');
        cy.contains('Row 3').should('exist');

        cy.contains('Row 2').parent('tr').should('have.class', 'selected');
        cy.get('.chart').should('exist');
    });

    it('должно очищать данные при клике на кнопку "Очистить данные"', () => {
        cy.contains('Получить данные').click();
        cy.wait('@getData');
        cy.contains('Очистить данные').click();
        cy.contains('Нет данных для отображения').should('exist');
        cy.get('.chart').contains('Нет данных для отображения').should('exist');
    });

    it('должно менять выбранную строку и обновлять график при клике на строку таблицы', () => {
        cy.contains('Получить данные').click();
        cy.wait('@getData');

        cy.contains('Row 1').click();
        cy.contains('Row 1').parent('tr').should('have.class', 'selected');
        cy.get('.chart').should('exist');
    });

    it('должно экспортировать данные в CSV при клике на кнопку "Сохранить в CSV"', () => {
        cy.window().then(win => {
            cy.stub(win.document, 'createElement').returns({
                setAttribute: cy.stub(),
                style: {},
                click: cy.stub(),
            });
            cy.stub(win.document.body, 'appendChild').as('appendChildStub');
            cy.stub(win.document.body, 'removeChild').as('removeChildStub');
        });

        cy.contains('Получить данные').click();
        cy.wait('@getData');

        cy.contains('Сохранить в CSV').click();
        cy.get('@appendChildStub').should('have.been.called');
        cy.get('@removeChildStub').should('have.been.called');
    });
});