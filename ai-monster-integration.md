# AI-Generated Monster Integration Guide

## Using AI Image Generators for Game Monsters

### 1. **AI Image Generation Services**
- **Easy-Peasy.AI** - Monster-specific generator
- **DALL-E 3** - High quality, consistent style
- **Midjourney** - Artistic, detailed monsters
- **Stable Diffusion** - Free, open-source option
- **Leonardo.AI** - Game asset focused

### 2. **Recommended Monster Prompt Structure**
```
"cute cartoon monster for kids math game, [color] colored, 
simple design, friendly face, big eyes, transparent background, 
front facing, idle pose, digital art style"
```

### 3. **Monster Variations Needed**
- **Tier 1**: Simple, round, friendly monsters (blue/green)
- **Tier 2**: Medium complexity, more features (orange/purple)
- **Tier 3**: Complex, cool-looking monsters (red/gold)

### 4. **Animation States to Generate**
For each monster, generate multiple poses:
1. **Idle** - Standing/floating position
2. **Happy** - Celebrating (correct answer)
3. **Hurt** - Taking damage (wrong answer)
4. **Attack** - Action pose

### 5. **Integration Steps**

#### Step 1: Generate Monster Images
```javascript
// Monster configuration with AI-generated images
const MONSTER_SPRITES = {
    tier1: {
        idle: '/assets/monsters/tier1_idle.png',
        happy: '/assets/monsters/tier1_happy.png',
        hurt: '/assets/monsters/tier1_hurt.png',
        attack: '/assets/monsters/tier1_attack.png'
    },
    tier2: {
        idle: '/assets/monsters/tier2_idle.png',
        happy: '/assets/monsters/tier2_happy.png',
        hurt: '/assets/monsters/tier2_hurt.png',
        attack: '/assets/monsters/tier2_attack.png'
    },
    tier3: {
        idle: '/assets/monsters/tier3_idle.png',
        happy: '/assets/monsters/tier3_happy.png',
        hurt: '/assets/monsters/tier3_hurt.png',
        attack: '/assets/monsters/tier3_attack.png'
    }
};
```

#### Step 2: Create Monster Display System
```javascript
class MonsterDisplay {
    constructor(containerId, tier) {
        this.container = document.getElementById(containerId);
        this.tier = tier;
        this.currentState = 'idle';
        this.createMonsterElement();
    }
    
    createMonsterElement() {
        this.monsterImg = document.createElement('img');
        this.monsterImg.className = 'game-monster';
        this.monsterImg.src = MONSTER_SPRITES[this.tier][this.currentState];
        this.container.appendChild(this.monsterImg);
    }
    
    setState(state) {
        this.currentState = state;
        this.monsterImg.src = MONSTER_SPRITES[this.tier][state];
        
        // Add animation class
        this.monsterImg.classList.add(`monster-${state}`);
        
        // Remove animation class after animation completes
        setTimeout(() => {
            this.monsterImg.classList.remove(`monster-${state}`);
        }, 500);
    }
    
    playCorrectAnimation() {
        this.setState('happy');
        setTimeout(() => this.setState('idle'), 1000);
    }
    
    playWrongAnimation() {
        this.setState('hurt');
        setTimeout(() => this.setState('idle'), 1000);
    }
}
```

#### Step 3: CSS Animations
```css
.game-monster {
    width: 200px;
    height: 200px;
    transition: transform 0.3s ease;
}

.monster-happy {
    animation: bounce 0.5s ease;
}

.monster-hurt {
    animation: shake 0.5s ease;
}

.monster-attack {
    animation: attack 0.5s ease;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

@keyframes attack {
    0% { transform: scale(1) translateX(0); }
    50% { transform: scale(1.2) translateX(20px); }
    100% { transform: scale(1) translateX(0); }
}
```

### 6. **Free Alternatives**
If you don't want to use AI generation:
1. **Kenney.nl** - Free game assets
2. **OpenGameArt.org** - Community sprites
3. **Itch.io** - Free monster packs
4. **GameDev Market** - Affordable sprites

### 7. **Tips for AI Generation**
- Use consistent style prompts
- Generate at 512x512 or higher
- Request transparent backgrounds
- Create sprite sheets for efficiency
- Save in PNG format for transparency
