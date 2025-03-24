// Import module files
import { loadProjectOverview, renderProjectOverview } from './modules/projectOverview.js';
import { loadDevelopmentPhases, renderDevelopmentPhases } from './modules/developmentPhases.js';
import { loadDatabaseModels, renderDatabaseModels } from './modules/databaseModels.js';
import { loadAuthenticationSecurity, renderAuthenticationSecurity } from './modules/authenticationSecurity.js';
import { loadFrontendComponents, renderFrontendComponents } from './modules/frontendComponents.js';
import { loadBackendServices, renderBackendServices } from './modules/backendServices.js';

// Additional imports will be added as we create more modules

// Main Document Loader Object
const DocLoader = {
    // Document cached data
    cache: {},
    
    // Current document being viewed
    currentDoc: null,
    
    // Flag to track dark mode
    darkMode: false,
    
    /**
     * Initialize the application
     */
    init: function() {
        this.setupEventListeners();
        this.loadDefaultDocument();
        
        // Set dark mode based on user preference
        if (localStorage.getItem('darkMode') === 'true') {
            this.toggleDarkMode();
        }
    },
    
    /**
     * Set up all event listeners
     */
    setupEventListeners: function() {
        // Document navigation clicks
        document.querySelectorAll('[data-doc]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const docName = e.currentTarget.getAttribute('data-doc');
                this.loadDocument(docName);
                
                // Set the active link in sidebar
                document.querySelectorAll('.sidebar .nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
            });
        });
        
        // Section navigation clicks
        document.querySelectorAll('[data-section]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionName = e.currentTarget.getAttribute('data-section');
                this.loadSection(sectionName);
                
                // Set the active link in navbar
                document.querySelectorAll('.navbar-nav .nav-link').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                e.currentTarget.classList.add('active');
            });
        });
        
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleDarkMode();
        });
        
        // Search input
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') {
                    this.searchDocumentation(e.target.value);
                }
            });
        }
        
        // Phase view toggling (for development phases)
        document.addEventListener('click', (e) => {
            if (e.target.id === 'btn-phases-timeline' || e.target.id === 'btn-phases-details') {
                if (e.target.id === 'btn-phases-timeline') {
                    document.getElementById('phases-timeline').classList.remove('d-none');
                    document.getElementById('phases-details').classList.add('d-none');
                    document.getElementById('btn-phases-timeline').classList.add('active');
                    document.getElementById('btn-phases-details').classList.remove('active');
                } else {
                    document.getElementById('phases-timeline').classList.add('d-none');
                    document.getElementById('phases-details').classList.remove('d-none');
                    document.getElementById('btn-phases-timeline').classList.remove('active');
                    document.getElementById('btn-phases-details').classList.add('active');
                }
            }
        });
        
        // Database models search filter
        document.addEventListener('input', (e) => {
            if (e.target.id === 'db-models-search') {
                const searchTerm = e.target.value.toLowerCase();
                document.querySelectorAll('.model-item').forEach(item => {
                    const modelName = item.getAttribute('data-model-name');
                    if (modelName.includes(searchTerm)) {
                        item.style.display = 'block';
                    } else {
                        item.style.display = 'none';
                    }
                });
            }
        });
    },
    
    /**
     * Load the default document (project overview)
     */
    loadDefaultDocument: function() {
        this.loadDocument('project_overview');
    },
    
    /**
     * Load a specific document by name
     * @param {string} docName - Name of the document to load
     */
    async loadDocument(docName) {
        if (!docName) return;
        
        this.showLoadingIndicator();
        this.currentDoc = docName;
        
        try {
            // Check if we have cached data
            if (!this.cache[docName]) {
                let data;
                
                // Load data based on document type
                switch (docName) {
                    case 'project_overview':
                        data = await loadProjectOverview();
                        break;
                    case 'development_phases':
                        data = await loadDevelopmentPhases();
                        break;
                    case 'database_models':
                        data = await loadDatabaseModels();
                        break;
                    case 'authentication_security':
                        data = await loadAuthenticationSecurity();
                        break;
                    case 'frontend_components':
                        data = await loadFrontendComponents();
                        break;
                    case 'backend_services':
                        data = await loadBackendServices();
                        break;
                    /* Additional cases will be added for each document type */
                    default:
                        // Generic document loading as fallback
                        const response = await fetch(`doc/${docName}.json`);
                        if (!response.ok) {
                            throw new Error(`Failed to load document: ${response.status}`);
                        }
                        data = await response.json();
                }
                
                // Cache the loaded data
                this.cache[docName] = data;
            }
            
            // Render the document content
            this.renderDocumentContent(this.cache[docName], docName);
        } catch (error) {
            console.error(`Error loading document ${docName}:`, error);
            this.showError(`فشل في تحميل الوثيقة: ${docName}`);
        } finally {
            this.hideLoadingIndicator();
        }
    },
    
    /**
     * Render document content based on type
     * @param {Object} data - The document data to render
     * @param {string} docType - The type of document
     */
    renderDocumentContent(data, docType) {
        let contentHtml = '';
        
        // Render based on document type
        switch (docType) {
            case 'project_overview':
                contentHtml = renderProjectOverview(data);
                break;
            case 'development_phases':
                contentHtml = renderDevelopmentPhases(data);
                break;
            case 'database_models':
                contentHtml = renderDatabaseModels(data);
                break;
            case 'authentication_security':
                contentHtml = renderAuthenticationSecurity(data);
                break;
            case 'frontend_components':
                contentHtml = renderFrontendComponents(data);
                break;
            case 'backend_services':
                contentHtml = renderBackendServices(data);
                break;
            /* Additional cases will be added for each document type */
            default:
                contentHtml = this.renderGenericDocument(data);
        }
        
        // Update the content area
        document.getElementById('content-area').innerHTML = contentHtml;
        
        // Add fade-in animation to content
        const contentArea = document.getElementById('content-area');
        contentArea.classList.add('animate__animated', 'animate__fadeIn');
        
        // Remove animation classes after animation completes
        setTimeout(() => {
            contentArea.classList.remove('animate__animated', 'animate__fadeIn');
        }, 1000);
    },
    
    /**
     * Generic document renderer for any JSON data
     * @param {Object} data - The document data to render
     * @returns {string} - HTML content for display
     */
    renderGenericDocument(data) {
        return `
        <div class="alert alert-info">
            <i class="bi bi-info-circle"></i> هذا المحتوى قيد التطوير. تم تحميل البيانات بنجاح.
        </div>
        <pre>${JSON.stringify(data, null, 2)}</pre>`;
    },
    
    /**
     * Load a section of the application (Home, Phases, etc.)
     * @param {string} sectionName - The section to load
     */
    loadSection(sectionName) {
        switch (sectionName) {
            case 'home':
                document.getElementById('content-area').innerHTML = document.getElementById('home-section').innerHTML;
                break;
            case 'phases':
                this.loadDocument('development_phases');
                break;
            case 'models':
                this.loadDocument('database_models');
                break;
            case 'frontend':
                this.loadDocument('frontend_components');
                break;
            case 'backend':
                this.loadDocument('backend_services');
                break;
            case 'team':
                this.loadDocument('team_allocation');
                break;
            default:
                console.warn(`Unknown section: ${sectionName}`);
        }
    },
    
    /**
     * Search through documentation
     * @param {string} searchTerm - The term to search for
     */
    searchDocumentation(searchTerm) {
        if (!searchTerm) return;
        
        alert(`البحث عن: "${searchTerm}" - هذه الميزة قيد التطوير`);
        // Future implementation of search functionality
    },
    
    /**
     * Toggle dark/light mode
     */
    toggleDarkMode() {
        document.body.classList.toggle('dark-mode');
        this.darkMode = !this.darkMode;
        
        // Update theme toggle button icon
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.innerHTML = this.darkMode 
                ? '<i class="bi bi-sun"></i>' 
                : '<i class="bi bi-moon-stars"></i>';
        }
        
        // Save preference to localStorage
        localStorage.setItem('darkMode', this.darkMode);
    },
    
    /**
     * Show loading indicator
     */
    showLoadingIndicator() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
        }
    },
    
    /**
     * Hide loading indicator
     */
    hideLoadingIndicator() {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    },
    
    /**
     * Show error message
     * @param {string} message - The error message to display
     */
    showError(message) {
        document.getElementById('content-area').innerHTML = `
        <div class="alert alert-danger mt-4">
            <i class="bi bi-exclamation-triangle"></i> ${message}
        </div>`;
    }
};

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    DocLoader.init();
}); 