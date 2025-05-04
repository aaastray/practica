import csvExportService from '/services/csvExport';

describe('CSV Export Service', () => {
    test('должен корректно преобразовывать данные в CSV', () => {
        const testData = [
            { id: 1, name: 'Test 1', value: 100 },
            { id: 2, name: 'Test, with comma', value: 200 }
        ];

        const expected = 'id,name,value\n"1","Test 1","100"\n"2","Test, with comma","200"';

        expect(csvExportService.convertToCSV(testData)).toBe(expected);
    });

    // Тест с моками DOM API
    test('должен вызывать правильные DOM API при экспорте', () => {
        global.URL.createObjectURL = jest.fn(() => 'blob:url');
        const mockLink = {
            setAttribute: jest.fn(),
            click: jest.fn(),
            style: {}
        };
        document.createElement = jest.fn(() => mockLink);
        document.body.appendChild = jest.fn();
        document.body.removeChild = jest.fn();

        const testData = [{ id: 1, name: 'Test', value: 100 }];

        csvExportService.exportToCSV(testData, 'test.csv');

        expect(document.createElement).toHaveBeenCalledWith('a');
        expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'blob:url');
        expect(mockLink.setAttribute).toHaveBeenCalledWith('download', 'test.csv');
        expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
        expect(mockLink.click).toHaveBeenCalled();
        expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    });
});