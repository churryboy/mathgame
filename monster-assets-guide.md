# Monster Assets Integration Guide

## Free Monster Sprite Resources

### 1. **OpenGameArt Monster Packs** (Recommended)
Visit these URLs to download free monster sprites:

1. **Pixel Monsters Pack**
   - URL: https://opengameart.org/content/pixel-monsters-pack
   - License: CC0 (Free for any use)
   - Contains: Multiple monster sprites with animations

2. **Monster Pack 1**
   - URL: https://opengameart.org/content/monster-pack-1
   - License: CC-BY 3.0
   - Contains: Various monster designs

3. **Cute Monster Sprites**
   - URL: https://opengameart.org/content/cute-monster-sprites
   - License: CC0
   - Contains: Kid-friendly monster designs

### 2. **Setting Up Monster Assets**

Create this folder structure in your project:
```
mathgame/
├── assets/
│   └── monsters/
│       ├── tier1/
│       │   ├── idle.png
│       │   ├── happy.png
│       │   ├── hurt.png
│       │   └── attack.png
│       ├── tier2/
│       │   └── (same files)
│       └── tier3/
│           └── (same files)
```

### 3. **Quick Setup Script**
Run these commands to create the folder structure:

```bash
cd /Users/churryboy/QStore/mathgame
mkdir -p assets/monsters/{tier1,tier2,tier3}
```

### 4. **Placeholder Monster Images**
For testing, you can use these placeholder services:

```javascript
// Placeholder monster URLs for testing
const PLACEHOLDER_MONSTERS = {
    tier1: {
        idle: 'https://via.placeholder.com/200x200/4FC3F7/ffffff?text=Tier1+Idle',
        happy: 'https://via.placeholder.com/200x200/4FC3F7/ffffff?text=Tier1+Happy',
        hurt: 'https://via.placeholder.com/200x200/4FC3F7/ffffff?text=Tier1+Hurt',
        attack: 'https://via.placeholder.com/200x200/4FC3F7/ffffff?text=Tier1+Attack'
    },
    tier2: {
        idle: 'https://via.placeholder.com/200x200/BA68C8/ffffff?text=Tier2+Idle',
        happy: 'https://via.placeholder.com/200x200/BA68C8/ffffff?text=Tier2+Happy',
        hurt: 'https://via.placeholder.com/200x200/BA68C8/ffffff?text=Tier2+Hurt',
        attack: 'https://via.placeholder.com/200x200/BA68C8/ffffff?text=Tier2+Attack'
    },
    tier3: {
        idle: 'https://via.placeholder.com/200x200/FF5722/ffffff?text=Tier3+Idle',
        happy: 'https://via.placeholder.com/200x200/FF5722/ffffff?text=Tier3+Happy',
        hurt: 'https://via.placeholder.com/200x200/FF5722/ffffff?text=Tier3+Hurt',
        attack: 'https://via.placeholder.com/200x200/FF5722/ffffff?text=Tier3+Attack'
    }
};
```

### 5. **Integration in game.js**

Update your monster display code:

```javascript
// In your startGame or updateMonster function
function displayMonster(stage) {
    const monsterDisplay = document.getElementById('monster-display');
    const tier = this.monsterSystem.getTierFromStage(stage);
    
    // Option 1: Use actual image files
    const monsterImage = document.createElement('img');
    monsterImage.src = `assets/monsters/tier${tier}/idle.png`;
    monsterImage.className = 'game-monster';
    
    // Option 2: Use placeholder URLs for testing
    // monsterImage.src = PLACEHOLDER_MONSTERS[`tier${tier}`].idle;
    
    monsterDisplay.innerHTML = '';
    monsterDisplay.appendChild(monsterImage);
}
```

### 6. **Free Sprite Sheet Tools**

1. **TexturePacker** (Free version)
   - URL: https://www.codeandweb.com/texturepacker
   - Use: Combine individual sprites into sprite sheets

2. **Piskel** (Online, Free)
   - URL: https://www.piskelapp.com/
   - Use: Create or edit pixel art monsters

3. **Aseprite** (Paid, but worth it)
   - URL: https://www.aseprite.org/
   - Use: Professional pixel art and animation

### 7. **Monster Generation Workflow**

1. **Download free sprites** from OpenGameArt
2. **Resize images** to 200x200px for consistency
3. **Create variations** for each animation state
4. **Save as PNG** with transparent background
5. **Place in appropriate folders**

### 8. **CSS for Image-based Monsters**

```css
.game-monster {
    width: 200px;
    height: 200px;
    object-fit: contain;
    image-rendering: pixelated; /* For pixel art */
    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.3));
}

.game-monster.animating-happy {
    animation: bounce 0.6s ease;
}

.game-monster.animating-hurt {
    animation: shake 0.5s ease;
    filter: brightness(0.5) sepia(1) hue-rotate(-50deg);
}
```

### 9. **Example Monster State Manager**

```javascript
class MonsterStateManager {
    constructor(tier) {
        this.tier = tier;
        this.currentState = 'idle';
        this.element = null;
    }
    
    setState(newState) {
        if (this.element) {
            this.element.src = `assets/monsters/tier${this.tier}/${newState}.png`;
            this.element.className = `game-monster animating-${newState}`;
            
            // Remove animation class after animation completes
            setTimeout(() => {
                this.element.className = 'game-monster';
                if (newState !== 'idle') {
                    this.setState('idle');
                }
            }, 1000);
        }
    }
}
```

### 10. **Next Steps**

1. Download monster sprites from the URLs above
2. Create the folder structure
3. Process and save the images
4. Update game.js to use the new monster system
5. Test animations with different states
6. Add particle effects for extra polish
