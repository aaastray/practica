const csvExportService = {
    exportToCSV(data, filename = 'export.csv') {
        const csvContent = this.convertToCSV(data);

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    },
    convertToCSV(data) {
        const headers = Object.keys(data[0]);
        const headerRow = headers.join(',');
        const rows = data.map(row => {
            return headers.map(header => {
                const value = row[header].toString();
                return `"${value.replace(/"/g, '""')}"`;
            }).join(',');
        });

        return [headerRow, ...rows].join('\n');
    }
};

export default csvExportService;