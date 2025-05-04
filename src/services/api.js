const apiService = {
    async getData() {
        try {
            const response = await fetch('https://api.example.com/data');
            if (!response.ok) {
                throw new Error('Ошибка при получении данных');
            }
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
};

export default apiService;