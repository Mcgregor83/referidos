// admin.js - Panel de administración

class AdminPanel {
    constructor() {
        this.data = {
            profile: {
                name: "Mi Hub de Enlaces de Referido",
                description: "Los mejores enlaces para ahorrar y ganar dinero",
                bio: "",
                avatar: ""
            },
            settings: {
                theme: "professional",
                showStats: true,
                showClickCounter: true
            },
            links: [],
            categories: {
                general: { name: "General", icon: "🔗", color: "#6c757d" },
                finanzas: { name: "Finanzas", icon: "💰", color: "#28a745" },
                viajes: { name: "Viajes", icon: "✈️", color: "#007bff" },
                tecnologia: { name: "Tecnología", icon: "💻", color: "#6f42c1" },
                shopping: { name: "Shopping", icon: "🛒", color: "#fd7e14" },
                entretenimiento: { name: "Entretenimiento", icon: "🎵", color: "#e83e8c" }
            }
        };

        this.editingLink = null;
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.renderProfile();
        this.renderLinks();
        this.updateStats();
        this.applyTheme();
    }

    loadData() {
        const saved = localStorage.getItem('referralHubData');
        if (saved) {
            try {
                const parsedData = JSON.parse(saved);
                this.data = { ...this.data, ...parsedData };
            } catch (e) {
                console.error('Error cargando datos:', e);
            }
        }
    }

    saveData() {
        localStorage.setItem('referralHubData', JSON.stringify(this.data));
        this.showNotification('Datos guardados correctamente', 'success');
    }

    setupEventListeners() {
        // Formulario de perfil
        document.getElementById('profileName').addEventListener('input', (e) => {
            this.data.profile.name = e.target.value;
        });

        document.getElementById('profileDescription').addEventListener('input', (e) => {
            this.data.profile.description = e.target.value;
        });

        document.getElementById('profileBio').addEventListener('input', (e) => {
            this.data.profile.bio = e.target.value;
        });

        document.getElementById('profileAvatar').addEventListener('input', (e) => {
            this.data.profile.avatar = e.target.value;
        });

        // Selectores de tema
        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                this.changeTheme(option.dataset.theme);
            });
        });

        // Formulario de enlaces
        document.getElementById('linkForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveLinkForm();
        });
    }

    renderProfile() {
        document.getElementById('profileName').value = this.data.profile.name;
        document.getElementById('profileDescription').value = this.data.profile.description;
        document.getElementById('profileBio').value = this.data.profile.bio || '';
        document.getElementById('profileAvatar').value = this.data.profile.avatar || '';
    }

    renderLinks() {
        const container = document.getElementById('linksList');

        if (this.data.links.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <h3>No hay enlaces configurados</h3>
                    <p>Añade tu primer enlace de referido</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.data.links.map(link => `
            <div class="link-admin-item" data-link-id="${link.id}">
                <div class="link-admin-emoji">${link.emoji}</div>
                <div class="link-admin-content">
                    <div class="link-admin-title">
                        ${link.title}
                        ${!link.active ? '<span style="color: var(--warning); font-size: 12px;">(INACTIVO)</span>' : ''}
                    </div>
                    <div class="link-admin-url">${link.url}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">
                        ${this.data.categories[link.category]?.name || 'General'} • ${link.clicks || 0} clicks
                    </div>
                </div>
                <div class="link-admin-actions">
                    <button class="btn btn-small secondary" onclick="adminPanel.editLink(${link.id})">✏️ Editar</button>
                    <button class="btn btn-small ${link.active ? 'warning' : 'success'}" 
                            onclick="adminPanel.toggleLink(${link.id})">
                        ${link.active ? '⏸️ Pausar' : '▶️ Activar'}
                    </button>
                    <button class="btn btn-small danger" onclick="adminPanel.deleteLink(${link.id})">🗑️ Eliminar</button>
                </div>
            </div>
        `).join('');
    }

    updateStats() {
        const totalLinks = this.data.links.length;
        const activeLinks = this.data.links.filter(link => link.active).length;
        const totalClicks = this.data.links.reduce((sum, link) => sum + (link.clicks || 0), 0);
        const avgClicks = totalLinks > 0 ? Math.round(totalClicks / totalLinks) : 0;

        document.getElementById('totalLinksAdmin').textContent = totalLinks;
        document.getElementById('activeLinksAdmin').textContent = activeLinks;
        document.getElementById('totalClicksAdmin').textContent = totalClicks.toLocaleString();
        document.getElementById('avgClicksAdmin').textContent = avgClicks;
    }

    changeTheme(theme) {
        this.data.settings.theme = theme;
        this.applyTheme();

        // Actualizar selector visual
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        document.querySelector(`[data-theme="${theme}"]`).classList.add('active');

        this.showNotification(`Tema cambiado a: ${theme}`, 'success');
    }

    applyTheme() {
        const theme = this.data.settings.theme;
        document.body.dataset.theme = theme;

        // Marcar tema activo
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.remove('active');
        });
        const activeTheme = document.querySelector(`[data-theme="${theme}"]`);
        if (activeTheme) {
            activeTheme.classList.add('active');
        }
    }

    addNewLink() {
        this.editingLink = null;
        this.clearLinkForm();
        document.getElementById('modalTitle').textContent = 'Añadir Nuevo Enlace';
        document.getElementById('linkModal').style.display = 'flex';
    }

    editLink(linkId) {
        const link = this.data.links.find(l => l.id === linkId);
        if (!link) return;

        this.editingLink = linkId;
        this.fillLinkForm(link);
        document.getElementById('modalTitle').textContent = 'Editar Enlace';
        document.getElementById('linkModal').style.display = 'flex';
    }

    fillLinkForm(link) {
        document.getElementById('linkEmoji').value = link.emoji || '';
        document.getElementById('linkTitle').value = link.title || '';
        document.getElementById('linkUrl').value = link.url || '';
        document.getElementById('linkDescription').value = link.description || '';
        document.getElementById('linkCategory').value = link.category || 'general';
        document.getElementById('linkActive').checked = link.active !== false;
    }

    clearLinkForm() {
        document.getElementById('linkEmoji').value = '';
        document.getElementById('linkTitle').value = '';
        document.getElementById('linkUrl').value = '';
        document.getElementById('linkDescription').value = '';
        document.getElementById('linkCategory').value = 'general';
        document.getElementById('linkActive').checked = true;
    }

    saveLinkForm() {
        const formData = {
            emoji: document.getElementById('linkEmoji').value || '🔗',
            title: document.getElementById('linkTitle').value,
            url: document.getElementById('linkUrl').value,
            description: document.getElementById('linkDescription').value,
            category: document.getElementById('linkCategory').value,
            active: document.getElementById('linkActive').checked
        };

        if (!formData.title || !formData.url) {
            this.showNotification('Título y URL son obligatorios', 'error');
            return;
        }

        if (this.editingLink) {
            // Editar enlace existente
            const linkIndex = this.data.links.findIndex(l => l.id === this.editingLink);
            if (linkIndex !== -1) {
                this.data.links[linkIndex] = {
                    ...this.data.links[linkIndex],
                    ...formData,
                    updatedAt: new Date().toISOString()
                };
            }
        } else {
            // Crear nuevo enlance
            const newLink = {
                id: Date.now(),
                ...formData,
                clicks: 0,
                createdAt: new Date().toISOString()
            };
            this.data.links.push(newLink);
        }

        this.closeModal();
        this.renderLinks();
        this.updateStats();
        this.showNotification(
            this.editingLink ? 'Enlace actualizado' : 'Enlace añadido', 
            'success'
        );
    }

    toggleLink(linkId) {
        const link = this.data.links.find(l => l.id === linkId);
        if (link) {
            link.active = !link.active;
            this.renderLinks();
            this.updateStats();
            this.showNotification(
                `Enlace ${link.active ? 'activado' : 'desactivado'}`, 
                'success'
            );
        }
    }

    deleteLink(linkId) {
        if (!confirm('¿Estás seguro de que quieres eliminar este enlace?')) {
            return;
        }

        this.data.links = this.data.links.filter(l => l.id !== linkId);
        this.renderLinks();
        this.updateStats();
        this.showNotification('Enlace eliminado', 'success');
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `referral-hub-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showNotification('Datos exportados correctamente', 'success');
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importedData = JSON.parse(e.target.result);
                        if (confirm('¿Estás seguro? Esto reemplazará todos los datos actuales.')) {
                            this.data = { ...this.data, ...importedData };
                            this.saveData();
                            this.renderProfile();
                            this.renderLinks();
                            this.updateStats();
                            this.applyTheme();
                            this.showNotification('Datos importados correctamente', 'success');
                        }
                    } catch (error) {
                        this.showNotification('Error al importar: archivo inválido', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    resetData() {
        if (!confirm('¿Estás seguro? Esto eliminará TODOS los datos y no se puede deshacer.')) {
            return;
        }

        if (!confirm('¿Realmente seguro? Esta acción es IRREVERSIBLE.')) {
            return;
        }

        localStorage.removeItem('referralHubData');
        location.reload();
    }

    previewTheme() {
        window.open('index.html', '_blank');
    }

    closeModal() {
        document.getElementById('linkModal').style.display = 'none';
        this.clearLinkForm();
        this.editingLink = null;
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Funciones globales para el panel de administración
function saveData() {
    window.adminPanel.saveData();
}

function exportData() {
    window.adminPanel.exportData();
}

function importLinks() {
    window.adminPanel.importData();
}

function resetData() {
    window.adminPanel.resetData();
}

function addNewLink() {
    window.adminPanel.addNewLink();
}

function previewTheme() {
    window.adminPanel.previewTheme();
}

function toggleTheme() {
    const admin = window.adminPanel;
    const themes = ['professional', 'dark', 'ocean', 'sunset', 'nature', 'minimal'];
    const currentTheme = admin.data.settings.theme;
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    admin.changeTheme(nextTheme);
}

function closeModal() {
    window.adminPanel.closeModal();
}

// Event listeners globales
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Inicializar panel de administración
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});

// Auto-guardado cada 30 segundos
setInterval(() => {
    if (window.adminPanel) {
        localStorage.setItem('referralHubData', JSON.stringify(window.adminPanel.data));
    }
}, 30000);
