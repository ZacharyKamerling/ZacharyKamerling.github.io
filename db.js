const db = {
    getCharacters() {
        return JSON.parse(localStorage.getItem('characters') || '[]');
    },
    getCharacter(id) {
        return this.getCharacters().find(c => c.id === id);
    },
    saveCharacter(updatedCharacter) {
        const chars = this.getCharacters();
        const index = chars.findIndex(c => c.id === updatedCharacter.id);
        if (index >= 0) {
            chars[index] = updatedCharacter;
        } else {
            chars.push(updatedCharacter);
        }
        localStorage.setItem('characters', JSON.stringify(chars));
    },

    deleteCharacter(id) {
        const characters = this.getCharacters().filter(c => c.id !== id);
        localStorage.setItem('characters', JSON.stringify(characters));
    },
};