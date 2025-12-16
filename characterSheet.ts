import { db } from './data/db.js';
import { Character } from './models/character.js';
import { CharacterView } from './views/characterView.js';
import { CharacterController } from './controllers/characterController.js';

const characterId = new URLSearchParams(window.location.search).get('id')!;
const rawCharacter = db.getCharacter(characterId);
if (!rawCharacter) {
    alert("Character not found!");
    window.location.href = "index.html";
    throw new Error("Character not found");
}
const character = Character.fromRaw(rawCharacter);

const view = new CharacterView();
new CharacterController(character, view);