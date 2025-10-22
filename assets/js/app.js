// app.js - JavaScript principal para el hub de enlaces

class ReferralHub {
    constructor() {
        this.data = {
            profile: {
                name: "Mi Hub de Enlaces de Referido",
                description: "Los mejores enlaces para ahorrar y ganar dinero",
                bio: "",
                avatar: "",
                initials: "MH"
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

        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.loadData();
        this.loadSampleData();
        this.applyTheme();
        this.renderProfile();
        this.renderCategories();
        this.renderLinks();
        this.updateStats();
    }

    loadData() {
        const saved = localStorage.getItem('referralHubData');
        if (saved) {
            try {
                const parsedData = JSON.parse(saved);
                this.data = { ...this.data, ...parsedData };
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }
    }

    loadSampleData() {
        if (this.data.links.length === 0) {
            this.data.links = [
                {
                    id: 1,
                    title: "💰 Revolut - Banco Digital",
                    url: "https://revolut.com/referral/example123",
                    description: "Consigue hasta €50 gratis al registrarte con mi enlace",
                    category: "finanzas",
                    emoji: "💰",
                    active: true,
                    clicks: 145,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 2,
                    title: "✈️ Booking.com Genius",
                    url: "https://booking.com/ref/affiliate456",
                    description: "Descuentos del 10-15% en más de 1 millón de alojamientos",
                    category: "viajes",
                    emoji: "✈️",
                    active: true,
                    clicks: 89,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 3,
                    title: "🛒 Amazon Associates",
                    url: "https://amazon.es/associate/ref789",
                    description: "Las mejores ofertas de Amazon con cashback exclusivo",
                    category: "shopping",
                    emoji: "🛒",
                    active: true,
                    clicks: 203,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 4,
                    title: "🏦 N26 - Cuenta Premium",
                    url: "https://n26.com/invite/example",
                    description: "Cuenta 100% online sin comisiones + €25 de bono",
                    category: "finanzas",
                    emoji: "🏦",
                    active: true,
                    clicks: 67,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 5,
                    title: "🏠 Airbnb Experiences",
                    url: "https://airbnb.com/invite/example",
                    description: "€35 de crédito para tu primera reserva de alojamiento",
                    category: "viajes",
                    emoji: "🏠",
                    active: true,
                    clicks: 123,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 6,
                    title: "💻 Hostinger Pro",
                    url: "https://hostinger.com/ref/example",
                    description: "Hosting web profesional desde €1.99/mes con SSL gratis",
                    category: "tecnologia",
                    emoji: "💻",
                    active: true,
                    clicks: 45,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 7,
                    title: "🔒 NordVPN Premium",
                    url: "https://nordvpn.com/ref/example",
                    description: "VPN segura con 70% descuento + 3 meses gratis",
                    category: "tecnologia",
                    emoji: "🔒",
                    active: true,
                    clicks: 78,
                    createdAt: new Date().toISOString()
                },
                {
                    id: 8,
                    title: "💳 Wise (ex-TransferWise)",
                    url: "https://wise.com/invite/example",
                    description: "Envía dinero al extranjero sin comisiones ocultas",
                    category: "finanzas",
                    emoji: "💳",
                    active: true,
                    clicks: 56,
                    createdAt: new Date().toISOString()
                }
            ];
            this.saveData();
        }
    }

    saveData() {
        localStorage.setItem('referralHubData', JSON.stringify(this.data));
    }

    renderProfile() {
        document.getElementById('profileName').textContent = this.data.profile.name;
        document.getElementById('profileDescription').textContent = this.data.profile.description;

        const avatar = document.getElementById('profileAvatar');
        const initials = document.getElementById('profileInitials');

        if (this.data.profile.avatar) {
            avatar.innerHTML = `<img src="${this.data.profile.avatar}" alt="Avatar" />`;
        } else {
            const nameWords = this.data.profile.name.split(' ');
            const profileInitials = nameWords.map(word => word[0]).join('').toUpperCase().substring(0, 2);
            initials.textContent = profileInitials;
        }
    }

    renderCategories() {
        const container = document.getElementById('categoryFilters');
        container.innerHTML = '<div class="category-filter active" data-category="all">🌟 Todos</div>';

        const usedCategories = [...new Set(this.data.links.map(link => link.category))];

        usedCategories.forEach(categoryId => {
            const category = this.data.categories[categoryId];
            if (category) {
                const filter = document.createElement('div');
                filter.className = 'category-filter';
                filter.dataset.category = categoryId;
                filter.innerHTML = `${category.icon} ${category.name}`;
                filter.addEventListener('click', () => this.filterByCategory(categoryId));
                container.appendChild(filter);
            }
        });

        // Event listener para "Todos"
        container.querySelector('[data-category="all"]').addEventListener('click', () => this.filterByCategory('all'));
    }

    filterByCategory(category) {
        this.currentFilter = category;

        // Actualizar filtros activos
        document.querySelectorAll('.category-filter').forEach(filter => {
            filter.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        // Renderizar enlaces filtrados
        this.renderLinks();
    }

    renderLinks() {
        const container = document.getElementById('linksContainer');

        let filteredLinks = this.data.links.filter(link => link.active);

        if (this.currentFilter !== 'all') {
            filteredLinks = filteredLinks.filter(link => link.category === this.currentFilter);
        }

        if (filteredLinks.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: var(--text-secondary);">
                    <h3>No hay enlaces en esta categoría</h3>
                    <p>Añade algunos enlaces desde el panel de administración</p>
                    <a href="admin.html" class="btn" style="margin-top: 20px;">➕ Añadir Enlaces</a>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredLinks.map(link => `
            <a href="${link.url}" class="link-item" target="_blank" rel="noopener noreferrer" 
               onclick="trackClick(${link.id})" data-link-id="${link.id}">
                <div class="link-header">
                    <div class="link-emoji">${link.emoji}</div>
                    <div class="link-content">
                        <div class="link-title">${link.title}</div>
                        <div class="link-description">${link.description}</div>
                        <div class="link-meta">
                            <span class="link-category" style="background-color: ${this.data.categories[link.category]?.color || '#6c757d'}">
                                ${this.data.categories[link.category]?.name || 'General'}
                            </span>
                            ${this.data.settings.showClickCounter ? `
                                <span class="link-clicks">
                                    👆 ${link.clicks} clicks
                                </span>
                            ` : ''}
                        </div>
                    </div>
                </div>
            </a>
        `).join('');
    }

    updateStats() {
        const totalLinks = this.data.links.length;
        const activeLinks = this.data.links.filter(link => link.active).length;
        const totalClicks = this.data.links.reduce((sum, link) => sum + (link.clicks || 0), 0);

        document.getElementById('totalLinks').textContent = totalLinks;
        document.getElementById('activeLinks').textContent = activeLinks;
        document.getElementById('totalClicks').textContent = totalClicks.toLocaleString();
    }

    applyTheme() {
        const theme = this.data.settings.theme;
        document.body.dataset.theme = theme;

        // Aplicar colores específicos del tema si es necesario
        const themes = {
            professional: { accent: '#667eea' },
            dark: { accent: '#4facfe' },
            ocean: { accent: '#4facfe' },
            sunset: { accent: '#fa709a' },
            nature: { accent: '#4CAF50' },
            minimal: { accent: '#007bff' }
        };

        if (themes[theme]) {
            document.documentElement.style.setProperty('--accent', themes[theme].accent);
        }
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

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
}

// Funciones globales
function trackClick(linkId) {
    const hub = window.referralHub;
    const link = hub.data.links.find(l => l.id === linkId);
    if (link) {
        link.clicks = (link.clicks || 0) + 1;
        link.lastClick = new Date().toISOString();
        hub.saveData();
        hub.updateStats();
    }
}

function toggleTheme() {
    const hub = window.referralHub;
    const currentTheme = hub.data.settings.theme;
    const themes = ['professional', 'dark', 'ocean', 'sunset', 'nature', 'minimal'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];

    hub.data.settings.theme = nextTheme;
    hub.saveData();
    hub.applyTheme();

    const themeNames = {
        professional: 'Profesional',
        dark: 'Oscuro',
        ocean: 'Océano',
        sunset: 'Atardecer',
        nature: 'Naturaleza',
        minimal: 'Minimalista'
    };

    hub.showNotification(`Tema cambiado a: ${themeNames[nextTheme]}`, 'success');
}

function shareHub() {
    const url = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: document.getElementById('profileName').textContent,
            text: document.getElementById('profileDescription').textContent,
            url: url
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(() => {
            window.referralHub.showNotification('URL copiada al portapapeles', 'success');
        });
    } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = url;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        window.referralHub.showNotification('URL copiada al portapapeles', 'success');
    }
}

function showQR() {
    const modal = document.getElementById('qrModal');
    const qrContainer = document.getElementById('qrCode');
    const url = window.location.href;

    // Generar QR simple usando una API pública
    qrContainer.innerHTML = `
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" 
             alt="Código QR" style="max-width: 100%;">
    `;

    modal.style.display = 'flex';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function showStats() {
    const hub = window.referralHub;
    const stats = {
        totalLinks: hub.data.links.length,
        activeLinks: hub.data.links.filter(l => l.active).length,
        totalClicks: hub.data.links.reduce((sum, link) => sum + (link.clicks || 0), 0),
        topLink: hub.data.links.sort((a, b) => (b.clicks || 0) - (a.clicks || 0))[0]
    };

    alert(`📊 Estadísticas del Hub:

Total de enlaces: ${stats.totalLinks}
Enlaces activos: ${stats.activeLinks}
Total de clicks: ${stats.totalClicks}
Enlace más popular: ${stats.topLink ? stats.topLink.title + ' (' + stats.topLink.clicks + ' clicks)' : 'N/A'}

Para ver estadísticas más detalladas, visita el Panel de Administración.`);
}

function exportData() {
    window.referralHub.exportData();
}

// Cerrar modal al hacer click fuera
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
});

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        shareHub();
    }
});

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    window.referralHub = new ReferralHub();
});

// PWA - Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
