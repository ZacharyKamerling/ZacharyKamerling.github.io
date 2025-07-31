export var db = {
    getCharacters: function () {
        return JSON.parse(localStorage.getItem('characters') || '[]');
    },
    getCharacter: function (id) {
        return this.getCharacters().find(function (c) { return c.id === id; });
    },
    saveCharacter: function (updatedCharacter) {
        var chars = this.getCharacters();
        var index = chars.findIndex(function (c) { return c.id === updatedCharacter.id; });
        if (index >= 0) {
            chars[index] = updatedCharacter;
        }
        else {
            chars.push(updatedCharacter);
        }
        localStorage.setItem('characters', JSON.stringify(chars));
    },
    deleteCharacter: function (id) {
        var characters = this.getCharacters().filter(function (c) { return c.id !== id; });
        localStorage.setItem('characters', JSON.stringify(characters));
    },
};
