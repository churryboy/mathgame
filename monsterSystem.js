// Monster Animation System for Math Monster Game
class MonsterAnimationSystem {
    constructor() {
        this.currentMonster = null;
        this.currentTier = 1;
        this.animationQueue = [];
        this.isAnimating = false;
        
        // Monster configurations for each tier
        this.monsterConfigs = {
            tier1: {
                name: '수학 새싹',
                baseColor: '#4FC3F7',
                emoji: '🐣', // Fallback emoji
                animations: {
                    idle: { duration: 2000, loop: true },
                    happy: { duration: 1000, loop: false },
                    hurt: { duration: 800, loop: false },
                    attack: { duration: 1200, loop: false },
                    evolve: { duration: 2000, loop: false }
                }
            },
            tier2: {
                name: '계산 전사',
                baseColor: '#BA68C8',
                emoji: '🐉',
                animations: {
                    idle: { duration: 2000, loop: true },
                    happy: { duration: 1000, loop: false },
                    hurt: { duration: 800, loop: false },
                    attack: { duration: 1200, loop: false },
                    evolve: { duration: 2000, loop: false }
                }
            },
            tier3: {
                name: '수학 대마왕',
                baseColor: '#FF5722',
                emoji: '🔥',
                animations: {
                    idle: { duration: 2000, loop: true },
                    happy: { duration: 1000, loop: false },
                    hurt: { duration: 800, loop: false },
                    attack: { duration: 1200, loop: false },
                    evolve: { duration: 2000, loop: false }
                }
            }
        };
        
        // Free monster sprite URLs (OpenGameArt examples)
        this.freeMonsterSprites = {
            tier1: {
                idle: 'https://opengameart.org/sites/default/files/Blue_Monster_Idle_4.png',
                walk: 'https://opengameart.org/sites/default/files/Blue_Monster_Walk_6.png',
                hurt: 'https://opengameart.org/sites/default/files/Blue_Monster_Hurt_4.png'
            },
            tier2: {
                idle: 'https://opengameart.org/sites/default/files/Red_Monster_Idle_4.png',
                walk: 'https://opengameart.org/sites/default/files/Red_Monster_Walk_6.png',
                hurt: 'https://opengameart.org/sites/default/files/Red_Monster_Hurt_4.png'
            }
        };
    }
    
    // Initialize monster display in the game
    initializeMonster(containerId, stage) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Determine tier based on stage
        this.currentTier = this.getTierFromStage(stage);
        const tierKey = `tier${this.currentTier}`;
        const config = this.monsterConfigs[tierKey];
        
        // Create monster element
        const monsterWrapper = document.createElement('div');
        monsterWrapper.className = 'monster-wrapper';
        monsterWrapper.innerHTML = `
            <div class="monster-container">
                <div class="monster-sprite" id="monster-sprite">
                    <img src="./public/images/123.avif" alt="Monster" class="monster-image" id="monster-image">
                </div>
                <div class="monster-effects" id="monster-effects"></div>
                <div class="monster-name">${config.name}</div>
            </div>
        `;
        
        container.appendChild(monsterWrapper);
        
        // Apply styles
        this.applyMonsterStyles(tierKey);
        
        // Start idle animation
        this.playAnimation('idle');
    }
    
    // Get tier based on stage
    getTierFromStage(stage) {
        if (stage <= 3) return 1;
        if (stage <= 6) return 2;
        return 3;
    }
    
    // Apply monster-specific styles
    applyMonsterStyles(tierKey) {
        const config = this.monsterConfigs[tierKey];
        const sprite = document.getElementById('monster-sprite');
        const monsterImg = document.getElementById('monster-image');
        
        if (sprite) {
            // Remove background to show image clearly
            sprite.style.background = 'transparent';
            sprite.style.boxShadow = `0 5px 15px ${config.baseColor}40`;
        }
        
        if (monsterImg) {
            // Apply tier-based filter to the image
            const hueRotate = this.currentTier === 1 ? 0 : 
                            this.currentTier === 2 ? 270 : 
                            this.currentTier === 3 ? 0 : 0;
            const brightness = this.currentTier === 3 ? 1.2 : 1;
            const saturate = this.currentTier === 3 ? 1.5 : 1;
            
            monsterImg.style.filter = `hue-rotate(${hueRotate}deg) brightness(${brightness}) saturate(${saturate})`;
        }
    }
    
    // Play specific animation
    playAnimation(animationType, callback) {
        const tierKey = `tier${this.currentTier}`;
        const config = this.monsterConfigs[tierKey];
        const animation = config.animations[animationType];
        
        if (!animation) return;
        
        const sprite = document.getElementById('monster-sprite');
        if (!sprite) return;
        
        // Remove all animation classes
        sprite.className = 'monster-sprite';
        
        // Add new animation class
        sprite.classList.add(`monster-${animationType}`);
        
        // Handle animation completion
        if (!animation.loop) {
            setTimeout(() => {
                sprite.classList.remove(`monster-${animationType}`);
                if (animationType !== 'idle') {
                    this.playAnimation('idle');
                }
                if (callback) callback();
            }, animation.duration);
        }
        
        // Add special effects for certain animations
        this.addAnimationEffects(animationType);
    }
    
    // Add particle effects for animations
    addAnimationEffects(animationType) {
        const effectsContainer = document.getElementById('monster-effects');
        if (!effectsContainer) return;
        
        effectsContainer.innerHTML = '';
        
        // Only flash effect for hurt animation, no particles
        if (animationType === 'hurt') {
            this.flashMonster('#FF0000', 300);
        }
    }
    
    // Create particle effects
    createParticles(container, emoji, count, className) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${className}`;
            particle.textContent = emoji;
            
            // Random position around monster
            const angle = (360 / count) * i + Math.random() * 30;
            const distance = 50 + Math.random() * 30;
            
            particle.style.setProperty('--angle', `${angle}deg`);
            particle.style.setProperty('--distance', `${distance}px`);
            particle.style.animationDelay = `${i * 0.1}s`;
            
            container.appendChild(particle);
            
            // Remove particle after animation
            setTimeout(() => particle.remove(), 1500);
        }
    }
    
    // Flash monster with color
    flashMonster(color, duration) {
        const sprite = document.getElementById('monster-sprite');
        if (!sprite) return;
        
        const originalFilter = sprite.style.filter;
        sprite.style.filter = `brightness(0.5) sepia(1) saturate(5) hue-rotate(${color === '#FF0000' ? '0' : '180'}deg)`;
        
        setTimeout(() => {
            sprite.style.filter = originalFilter;
        }, duration);
    }
    
    // Handle correct answer animation
    onCorrectAnswer() {
        this.playAnimation('happy', () => {
            // Return to idle after celebration
        });
    }
    
    // Handle wrong answer animation
    onWrongAnswer() {
        this.playAnimation('hurt', () => {
            // Monster attacks back
            setTimeout(() => {
                this.playAnimation('attack');
            }, 500);
        });
    }
    
    // Handle level up / evolution
    onLevelUp(newStage) {
        const newTier = this.getTierFromStage(newStage);
        
        if (newTier > this.currentTier) {
            // Evolution animation
            this.playAnimation('evolve', () => {
                this.currentTier = newTier;
                this.initializeMonster('monster-display', newStage);
            });
        }
    }
    
    // Utility function to darken color
    darkenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    // Load AI-generated or custom monster images
    loadMonsterImages(imageUrls) {
        // This function would load actual image files
        // For now, we'll use placeholders
        console.log('Loading monster images:', imageUrls);
    }
}

// Export for use in game.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MonsterAnimationSystem;
}
