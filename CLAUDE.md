# Claude Code Configuration

## Important: Version Increment

**Every time you make UI changes, increment the version number in `views/characterView.ts`:**

```typescript
private VERSION = '1.0.X';  // Increment X for UI changes
```

Then compile and push to master:
```bash
tsc && git add -A && git commit -m "Bump version to 1.0.X" && git push origin master
```

## Current Version
- **v1.0.7** - Latest stable

## Project Structure

- `/views/characterView.ts` - UI rendering and page layout
- `/controllers/characterController.ts` - Event listeners and state management
- `/models/character.ts` - Character data model
- `/utils/diceRollers.ts` - Dice rolling mechanics
- `/utils/cardDrawers.ts` - Card drawing mechanics
- `/styles.css` - Global styles
- `/character.html` - Character sheet page

## Key Implementation Details

### Page System
- 4 pages: Stats, Items, Abilities, Notes
- Sticky tab navigation with swipe support (80px threshold)
- Each page scrolls independently

### Character Model
- Properties: stats, tokens, items, abilities, notes, unarmored toggle
- Caching system for effective stats (with buff calculations)
- Proper serialization with `toJSON()`

### Important Notes
- DiceRoller and CardDrawer must be initialized AFTER view.render()
- CardDrawer requires card-result-box element to exist
- All event listeners must be re-attached after render
- Swipe threshold is 80px (less sensitive)
