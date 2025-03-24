/**
 * وحدة معالجة ملف خدمات الخلفية
 */

/**
 * تحميل بيانات خدمات الخلفية
 * @returns {Promise} - وعد يحتوي على بيانات خدمات الخلفية
 */
export async function loadBackendServices() {
    try {
        const response = await fetch('doc/backend_services.json');
        if (!response.ok) {
            throw new Error(`فشل تحميل ملف خدمات الخلفية: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطأ في تحميل بيانات خدمات الخلفية:', error);
        throw error;
    }
}

/**
 * معالجة وعرض بيانات خدمات الخلفية
 * @param {Object} data - بيانات خدمات الخلفية
 * @returns {string} - HTML لعرض بيانات خدمات الخلفية
 */
export function renderBackendServices(data) {
    if (!data || !data.backendServices) {
        return `<div class="alert alert-warning"><i class="bi bi-exclamation-triangle"></i> لا توجد بيانات لخدمات الخلفية</div>`;
    }

    const services = data.backendServices;
    
    let html = `
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><i class="bi bi-cpu"></i> خدمات الخلفية</h1>
    </div>
    
    <div class="doc-content">
        <div class="doc-section">
            <h3><i class="bi bi-info-circle"></i> نظرة عامة</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <p class="lead">${services.overview.description}</p>
                    
                    <div class="row mt-4">
                        <div class="col-md-6">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-diagram-3 text-primary me-2"></i> بنية خدمات الخلفية</h5>
                                </div>
                                <div class="card-body">
                                    <p>${services.overview.architecture}</p>
                                    <div class="d-flex flex-wrap mt-3">
                                        ${services.overview.technologies.map(tech => `
                                        <span class="badge bg-primary me-2 mb-2 p-2">
                                            <i class="bi bi-check-circle-fill me-1"></i> ${tech}
                                        </span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-layers text-primary me-2"></i> الطبقات الأساسية</h5>
                                </div>
                                <div class="card-body">
                                    <ul class="list-group">
                                        ${services.overview.coreLayers.map(layer => `
                                        <li class="list-group-item d-flex align-items-center">
                                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                                            <div>
                                                <strong>${layer.name}</strong>
                                                <p class="mb-0 small">${layer.description}</p>
                                            </div>
                                        </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-controller"></i> المتحكمات (Controllers)</h3>
            <div class="accordion mb-4" id="controllersAccordion">
                ${services.controllers.map((controller, index) => `
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading-controller-${index}">
                        <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#collapse-controller-${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" 
                                aria-controls="collapse-controller-${index}">
                            <i class="bi bi-controller me-2 text-primary"></i>
                            <strong>${controller.name}</strong>
                            <span class="badge bg-secondary ms-2">${controller.routes.length} مسار</span>
                        </button>
                    </h2>
                    <div id="collapse-controller-${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}"
                         aria-labelledby="heading-controller-${index}" data-bs-parent="#controllersAccordion">
                        <div class="accordion-body">
                            <div class="mb-3">
                                <h5><i class="bi bi-info-circle"></i> الوصف</h5>
                                <p>${controller.description}</p>
                            </div>
                            
                            <div class="mb-4">
                                <h5><i class="bi bi-link-45deg"></i> المسارات</h5>
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>الطريقة</th>
                                                <th>المسار</th>
                                                <th>الوصف</th>
                                                <th>الإجراء</th>
                                                <th>الصلاحيات</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${controller.routes.map(route => `
                                            <tr>
                                                <td>
                                                    <span class="badge bg-${
                                                        route.method === 'GET' ? 'success' : 
                                                        route.method === 'POST' ? 'primary' : 
                                                        route.method === 'PUT' ? 'warning' : 
                                                        route.method === 'DELETE' ? 'danger' : 'info'
                                                    }">${route.method}</span>
                                                </td>
                                                <td><code>${route.path}</code></td>
                                                <td>${route.description}</td>
                                                <td><code>${route.action}</code></td>
                                                <td>
                                                    ${route.authorization ? 
                                                        `<span class="badge bg-info">${route.authorization}</span>` : 
                                                        '<span class="badge bg-secondary">عام</span>'}
                                                </td>
                                            </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            <h5><i class="bi bi-file-earmark-code"></i> ملف التنفيذ</h5>
                            <p><code>${controller.implementationFile}</code></p>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-gear"></i> الخدمات (Services)</h3>
            <div class="row">
                ${services.services.map(service => `
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h5 class="mb-0"><i class="bi bi-gear-fill text-primary me-2"></i> ${service.name}</h5>
                        </div>
                        <div class="card-body">
                            <p>${service.description}</p>
                            
                            <h6 class="text-muted mb-2">الوظائف المتاحة:</h6>
                            <ul class="list-group mb-3">
                                ${service.methods.map(method => `
                                <li class="list-group-item d-flex align-items-center">
                                    <i class="bi bi-code-slash text-success me-2"></i>
                                    <div>
                                        <code>${method.name}</code>
                                        <p class="mb-0 small">${method.description}</p>
                                    </div>
                                </li>
                                `).join('')}
                            </ul>
                            
                            <h6 class="text-muted mb-2">الاعتماديات:</h6>
                            <div class="d-flex flex-wrap">
                                ${service.dependencies.map(dep => `
                                <span class="badge bg-secondary me-2 mb-2">${dep}</span>
                                `).join('')}
                            </div>
                        </div>
                        <div class="card-footer bg-light">
                            <code>${service.implementationFile}</code>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-hdd-network"></i> مراكز SignalR</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row">
                        ${services.signalRHubs.map(hub => `
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-broadcast text-primary me-2"></i> ${hub.name}</h5>
                                </div>
                                <div class="card-body">
                                    <p>${hub.description}</p>
                                    
                                    <h6 class="text-muted mb-2">الأحداث الخادمية:</h6>
                                    <ul class="list-group mb-3">
                                        ${hub.serverMethods.map(method => `
                                        <li class="list-group-item d-flex align-items-center">
                                            <i class="bi bi-arrow-up-right text-primary me-2"></i>
                                            <div>
                                                <code>${method.name}</code>
                                                <p class="mb-0 small">${method.description}</p>
                                            </div>
                                        </li>
                                        `).join('')}
                                    </ul>
                                    
                                    <h6 class="text-muted mb-2">الأحداث العميلة:</h6>
                                    <ul class="list-group">
                                        ${hub.clientMethods.map(method => `
                                        <li class="list-group-item d-flex align-items-center">
                                            <i class="bi bi-arrow-down-left text-success me-2"></i>
                                            <div>
                                                <code>${method.name}</code>
                                                <p class="mb-0 small">${method.description}</p>
                                            </div>
                                        </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <div class="card-footer bg-light d-flex justify-content-between">
                                    <code>${hub.implementationFile}</code>
                                    <span class="badge bg-info">المسار: ${hub.path}</span>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-journals"></i> المستودعات (Repositories)</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>المستودع</th>
                                    <th>نموذج البيانات</th>
                                    <th>الوصف</th>
                                    <th>الطرق المخصصة</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${services.repositories.map(repo => `
                                <tr>
                                    <td><strong>${repo.name}</strong></td>
                                    <td><code>${repo.model}</code></td>
                                    <td>${repo.description}</td>
                                    <td>
                                        <ul class="mb-0">
                                            ${repo.customMethods.map(method => `
                                            <li><code>${method}</code></li>
                                            `).join('')}
                                        </ul>
                                    </td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-shield-check"></i> المصادقة والصلاحيات</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-person-lock text-primary me-2"></i> نظام المصادقة</h5>
                                </div>
                                <div class="card-body">
                                    <p>${services.authorization.authenticationSystem}</p>
                                    <h6 class="text-muted mb-2">آليات المصادقة:</h6>
                                    <ul class="list-group">
                                        ${services.authorization.authenticationMethods.map(method => `
                                        <li class="list-group-item d-flex align-items-center">
                                            <i class="bi bi-shield-check text-success me-2"></i>
                                            ${method}
                                        </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-key text-primary me-2"></i> الصلاحيات</h5>
                                </div>
                                <div class="card-body">
                                    <p>${services.authorization.authorizationSystem}</p>
                                    <h6 class="text-muted mb-2">الأدوار:</h6>
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>الدور</th>
                                                    <th>الصلاحيات</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${services.authorization.roles.map(role => `
                                                <tr>
                                                    <td><strong>${role.name}</strong></td>
                                                    <td>
                                                        <ul class="mb-0 small">
                                                            ${role.permissions.map(perm => `
                                                            <li>${perm}</li>
                                                            `).join('')}
                                                        </ul>
                                                    </td>
                                                </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-activity"></i> أداء الخلفية</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-speedometer2 text-primary me-2"></i> استراتيجيات التخزين المؤقت</h5>
                                </div>
                                <div class="card-body">
                                    <ul class="list-group">
                                        ${services.performance.caching.map(cache => `
                                        <li class="list-group-item">
                                            <h6>${cache.strategy}</h6>
                                            <p class="mb-0 small">${cache.description}</p>
                                            ${cache.implementation ? `<code class="mt-2 d-block">${cache.implementation}</code>` : ''}
                                        </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-lightning-charge text-primary me-2"></i> تحسينات الأداء</h5>
                                </div>
                                <div class="card-body">
                                    <ul class="list-group">
                                        ${services.performance.optimizations.map(opt => `
                                        <li class="list-group-item">
                                            <h6>${opt.name}</h6>
                                            <p class="mb-0 small">${opt.description}</p>
                                        </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    return html;
} 