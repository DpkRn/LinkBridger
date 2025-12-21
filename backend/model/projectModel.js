const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    // Project name/identifier (singleton - only one project config)
    projectName: {
        type: String,
        default: 'LinkBridger',
        unique: true
    },
    
    // Available templates configuration
    availableTemplates: [{
        template: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: Boolean,
            default: true
        },
        displayName: {
            type: String,
            default: ''
        },
        description: {
            type: String,
            default: ''
        }
    }],
    
    // Other project configuration can be added here
    // e.g., maintenance mode, feature flags, etc.
    
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Static method to get or create project config (singleton pattern)
projectSchema.statics.getProjectConfig = async function() {
    let project = await this.findOne({ 
        projectName: 'LinkBridger',
        deletedAt: null 
    });
    
    if (!project) {
        // Initialize with default templates
        const defaultTemplates = [
            { template: 'default', status: true, displayName: 'Default', description: 'Clean and simple default template' },
            { template: 'minimal', status: true, displayName: 'Minimal', description: 'Minimalist design' },
            { template: 'modern', status: true, displayName: 'Modern', description: 'Modern and sleek design' },
            { template: 'dark', status: true, displayName: 'Dark', description: 'Dark theme template' },
            { template: 'light', status: true, displayName: 'Light', description: 'Light theme template' },
            { template: 'hacker', status: true, displayName: 'Hacker', description: 'Hacker-style template' },
            { template: 'glass', status: true, displayName: 'Glass', description: 'Glassmorphism design' },
            { template: 'neon', status: true, displayName: 'Neon', description: 'Neon glow effects' },
            { template: 'gradient', status: true, displayName: 'Gradient', description: 'Gradient backgrounds' },
            { template: 'cards', status: true, displayName: 'Cards', description: 'Card-based layout' },
            { template: 'particles', status: true, displayName: 'Particles', description: 'Particle effects' },
            { template: '3d', status: true, displayName: '3D', description: '3D effects template' },
            { template: 'retro', status: true, displayName: 'Retro', description: 'Retro style template' }
        ];
        
        project = await this.create({
            projectName: 'LinkBridger',
            availableTemplates: defaultTemplates
        });
    }
    
    return project;
};

const Project = mongoose.model('project', projectSchema);
module.exports = Project;

