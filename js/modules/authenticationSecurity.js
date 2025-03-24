/**
 * وحدة معالجة ملف المصادقة والأمان
 */

/**
 * تحميل بيانات المصادقة والأمان
 * @returns {Promise} - وعد يحتوي على بيانات المصادقة والأمان
 */
export async function loadAuthenticationSecurity() {
    try {
        const response = await fetch('doc/authentication_security.json');
        if (!response.ok) {
            throw new Error(`فشل تحميل ملف المصادقة والأمان: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطأ في تحميل بيانات المصادقة والأمان:', error);
        throw error;
    }
}

/**
 * معالجة وعرض بيانات المصادقة والأمان
 * @param {Object} data - بيانات المصادقة والأمان
 * @returns {string} - HTML لعرض بيانات المصادقة والأمان
 */
export function renderAuthenticationSecurity(data) {
    if (!data || !data.authenticationSecurity) {
        return `<div class="alert alert-warning"><i class="bi bi-exclamation-triangle"></i> لا توجد بيانات للمصادقة والأمان</div>`;
    }

    const authData = data.authenticationSecurity;
    
    let html = `
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><i class="bi bi-shield-lock"></i> المصادقة والأمان</h1>
    </div>
    
    <div class="doc-content">
        <div class="doc-section">
            <h3><i class="bi bi-person-check"></i> نظام المصادقة</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="mb-3">
                        <h5><i class="bi bi-stack"></i> الإطار المستخدم</h5>
                        <div class="alert alert-primary">
                            <strong>${authData.authenticationSystem.framework}</strong> - ${authData.authenticationSystem.description}
                        </div>
                    </div>
                    
                    <div class="row">
                        ${authData.authenticationSystem.components.map(component => `
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-puzzle text-primary me-2"></i> ${component.name}</h5>
                                </div>
                                <div class="card-body">
                                    <p>${component.description}</p>
                                    <h6 class="text-muted mb-2">الميزات:</h6>
                                    <ul class="list-group mb-3">
                                        ${component.features.map(feature => `
                                        <li class="list-group-item d-flex align-items-center">
                                            <i class="bi bi-check-circle-fill text-success me-2"></i> ${feature}
                                        </li>
                                        `).join('')}
                                    </ul>
                                    <div class="d-flex justify-content-between mt-3">
                                        <span class="badge bg-primary rounded-pill p-2">الأولوية: ${component.implementationPriority}</span>
                                        <span class="badge bg-secondary rounded-pill p-2">الجهد المقدر: ${component.estimatedEffort}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-lock"></i> أمان البيانات</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-shield-fill text-danger me-2"></i> حماية البيانات الحساسة</h5>
                                </div>
                                <div class="card-body">
                                    <p>${authData.dataSecurity.sensitiveDataProtection.description}</p>
                                    <h6 class="text-muted mb-2">إجراءات الحماية:</h6>
                                    <ul class="list-group">
                                        ${authData.dataSecurity.sensitiveDataProtection.measures.map(measure => `
                                        <li class="list-group-item">
                                            <i class="bi bi-shield-check text-primary me-2"></i> ${measure}
                                        </li>
                                        `).join('')}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-key-fill text-warning me-2"></i> تشفير البيانات</h5>
                                </div>
                                <div class="card-body">
                                    <p>${authData.dataSecurity.encryption.description}</p>
                                    <div class="table-responsive">
                                        <table class="table table-striped table-hover">
                                            <thead>
                                                <tr>
                                                    <th>نوع البيانات</th>
                                                    <th>طريقة التشفير</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${authData.dataSecurity.encryption.methods.map(method => `
                                                <tr>
                                                    <td><strong>${method.dataType}</strong></td>
                                                    <td>${method.encryptionMethod}</td>
                                                </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-database-lock text-info me-2"></i> أمان قاعدة البيانات</h5>
                                </div>
                                <div class="card-body">
                                    <p>${authData.dataSecurity.databaseSecurity.description}</p>
                                    <div class="row">
                                        ${authData.dataSecurity.databaseSecurity.practices.map(practice => `
                                        <div class="col-md-4 mb-3">
                                            <div class="card">
                                                <div class="card-body">
                                                    <h6 class="card-title">
                                                        <i class="bi bi-check-circle text-success me-2"></i>
                                                        ${practice.name}
                                                    </h6>
                                                    <p class="card-text small">${practice.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-award"></i> صلاحيات وأدوار المستخدمين</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead class="table-dark">
                                <tr>
                                    <th>الدور</th>
                                    <th>الوصف</th>
                                    <th>الصلاحيات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${authData.userRolesPermissions.roles.map(role => `
                                <tr>
                                    <td><strong>${role.name}</strong></td>
                                    <td>${role.description}</td>
                                    <td>
                                        <ul class="mb-0">
                                            ${role.permissions.map(permission => `
                                            <li>${permission}</li>
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
            <h3><i class="bi bi-exclamation-triangle"></i> الحماية من الهجمات</h3>
            <div class="row">
                ${authData.attackPrevention.map(attack => `
                <div class="col-md-4 mb-3">
                    <div class="card h-100">
                        <div class="card-header bg-danger text-white">
                            <h5 class="mb-0">
                                <i class="bi bi-shield-x me-2"></i> الحماية من ${attack.type}
                            </h5>
                        </div>
                        <div class="card-body">
                            <p class="mb-3">${attack.description}</p>
                            <h6 class="text-muted mb-2">طرق الحماية:</h6>
                            <ul class="list-group list-group-flush">
                                ${attack.preventionMethods.map(method => `
                                <li class="list-group-item d-flex align-items-start">
                                    <i class="bi bi-shield-fill-check text-success me-2 mt-1"></i>
                                    <div>${method}</div>
                                </li>
                                `).join('')}
                            </ul>
                        </div>
                        <div class="card-footer bg-light">
                            <small class="text-muted">درجة الخطورة: <span class="badge bg-${attack.riskLevel === 'عالية' ? 'danger' : attack.riskLevel === 'متوسطة' ? 'warning' : 'info'}">${attack.riskLevel}</span></small>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-list-check"></i> قائمة التحقق الأمني</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="progress mb-4">
                        <div class="progress-bar bg-success" role="progressbar" style="width: ${authData.securityChecklist.completionPercentage}%" aria-valuenow="${authData.securityChecklist.completionPercentage}" aria-valuemin="0" aria-valuemax="100">
                            ${authData.securityChecklist.completionPercentage}% مكتمل
                        </div>
                    </div>
                    
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th style="width: 60%">عنصر</th>
                                    <th style="width: 15%">الحالة</th>
                                    <th style="width: 25%">تعليق</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${authData.securityChecklist.items.map(item => `
                                <tr>
                                    <td>${item.name}</td>
                                    <td>
                                        <span class="badge ${item.status === 'مكتمل' ? 'bg-success' : item.status === 'قيد التنفيذ' ? 'bg-warning' : 'bg-danger'}">
                                            ${item.status}
                                        </span>
                                    </td>
                                    <td><small>${item.comment || '-'}</small></td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    return html;
} 