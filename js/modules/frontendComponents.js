/**
 * وحدة معالجة ملف مكونات الواجهة الأمامية
 */

/**
 * تحميل بيانات مكونات الواجهة الأمامية
 * @returns {Promise} - وعد يحتوي على بيانات مكونات الواجهة الأمامية
 */
export async function loadFrontendComponents() {
    try {
        const response = await fetch('doc/frontend_components.json');
        if (!response.ok) {
            throw new Error(`فشل تحميل ملف مكونات الواجهة الأمامية: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطأ في تحميل بيانات مكونات الواجهة الأمامية:', error);
        throw error;
    }
}

/**
 * معالجة وعرض بيانات مكونات الواجهة الأمامية
 * @param {Object} data - بيانات مكونات الواجهة الأمامية
 * @returns {string} - HTML لعرض بيانات مكونات الواجهة الأمامية
 */
export function renderFrontendComponents(data) {
    if (!data || !data.frontendComponents) {
        return `<div class="alert alert-warning"><i class="bi bi-exclamation-triangle"></i> لا توجد بيانات لمكونات الواجهة الأمامية</div>`;
    }

    const componentData = data.frontendComponents;
    
    let html = `
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><i class="bi bi-window"></i> مكونات الواجهة الأمامية</h1>
    </div>
    
    <div class="doc-content">
        <div class="doc-section">
            <h3><i class="bi bi-info-circle"></i> نظرة عامة</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <p class="lead">${componentData.overview.description}</p>
                    
                    <div class="row mt-4">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-tools text-primary me-2"></i> التقنيات المستخدمة</h5>
                                </div>
                                <div class="card-body">
                                    <div class="d-flex flex-wrap">
                                        ${componentData.overview.technologies.map(tech => `
                                        <span class="badge bg-primary me-2 mb-2 p-2">
                                            <i class="bi bi-check-circle-fill me-1"></i> ${tech}
                                        </span>
                                        `).join('')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-eye text-primary me-2"></i> مبادئ التصميم</h5>
                                </div>
                                <div class="card-body">
                                    <ul class="list-group">
                                        ${componentData.overview.designPrinciples.map(principle => `
                                        <li class="list-group-item d-flex align-items-center">
                                            <i class="bi bi-check-circle-fill text-success me-2"></i>
                                            ${principle}
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
            <h3><i class="bi bi-layout-text-window"></i> القوالب الرئيسية</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row">
                        ${componentData.templates.map(template => `
                        <div class="col-md-6 mb-4">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0">${template.name}</h5>
                                </div>
                                <div class="card-body">
                                    <p>${template.description}</p>
                                    <h6 class="text-muted mb-2">المكونات:</h6>
                                    <ul class="list-unstyled mb-3">
                                        ${template.components.map(component => `
                                        <li class="mb-1">
                                            <i class="bi bi-check-lg text-success me-2"></i>
                                            ${component}
                                        </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                <div class="card-footer bg-light d-flex justify-content-between align-items-center">
                                    <span class="badge bg-info">
                                        <i class="bi bi-file-earmark-code"></i> ${template.viewFile}
                                    </span>
                                    <span class="badge bg-secondary">
                                        <i class="bi bi-clock"></i> الجهد المتوقع: ${template.estimatedHours} ساعة
                                    </span>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-columns-gap"></i> صفحات الموقع</h3>
            
            <ul class="nav nav-tabs mb-3" id="pagesTab" role="tablist">
                ${Object.keys(componentData.pages).map((category, index) => `
                <li class="nav-item" role="presentation">
                    <button class="nav-link ${index === 0 ? 'active' : ''}" id="${category}-tab" data-bs-toggle="tab" 
                            data-bs-target="#${category}" type="button" role="tab">
                        <i class="bi bi-${category === 'publicPages' ? 'globe' : 
                                         category === 'customerPages' ? 'person' : 
                                         category === 'businessOwnerPages' ? 'shop' : 'person-workspace'} me-1"></i>
                        ${category === 'publicPages' ? 'الصفحات العامة' : 
                         category === 'customerPages' ? 'صفحات المستخدم' : 
                         category === 'businessOwnerPages' ? 'صفحات صاحب العمل' : 'صفحات الأدمن'}
                    </button>
                </li>
                `).join('')}
            </ul>
            
            <div class="tab-content" id="pagesTabContent">
                ${Object.entries(componentData.pages).map(([category, pages], index) => `
                <div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="${category}" role="tabpanel">
                    <div class="accordion" id="${category}Accordion">
                        ${pages.map((page, pageIndex) => `
                        <div class="accordion-item">
                            <h2 class="accordion-header" id="heading${category}${pageIndex}">
                                <button class="accordion-button ${pageIndex !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse"
                                        data-bs-target="#collapse${category}${pageIndex}" aria-expanded="${pageIndex === 0 ? 'true' : 'false'}"
                                        aria-controls="collapse${category}${pageIndex}">
                                    <i class="bi bi-file-earmark-text me-2 text-primary"></i>
                                    <strong>${page.name}</strong>
                                    <span class="badge bg-${page.priority === 'عالية' ? 'danger' : 
                                                           page.priority === 'متوسطة' ? 'warning' : 'info'} ms-2">
                                        ${page.priority}
                                    </span>
                                </button>
                            </h2>
                            <div id="collapse${category}${pageIndex}" class="accordion-collapse collapse ${pageIndex === 0 ? 'show' : ''}"
                                 aria-labelledby="heading${category}${pageIndex}" data-bs-parent="#${category}Accordion">
                                <div class="accordion-body">
                                    <div class="row">
                                        <div class="col-md-7">
                                            <div class="mb-3">
                                                <h5><i class="bi bi-info-circle"></i> وصف الصفحة</h5>
                                                <p>${page.description}</p>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <h5><i class="bi bi-card-list"></i> العناصر الرئيسية</h5>
                                                <ul class="list-group mb-3">
                                                    ${page.mainElements.map(element => `
                                                    <li class="list-group-item d-flex align-items-center">
                                                        <i class="bi bi-check-circle-fill text-success me-2"></i>
                                                        ${element}
                                                    </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                            
                                            <div class="mb-3">
                                                <h5><i class="bi bi-database"></i> متطلبات البيانات</h5>
                                                <ul class="list-group">
                                                    ${page.dataRequirements.map(req => `
                                                    <li class="list-group-item d-flex align-items-center">
                                                        <i class="bi bi-table me-2 text-primary"></i>
                                                        ${req}
                                                    </li>
                                                    `).join('')}
                                                </ul>
                                            </div>
                                        </div>
                                        
                                        <div class="col-md-5">
                                            <div class="card h-100">
                                                <div class="card-header bg-light">
                                                    <h5 class="mb-0"><i class="bi bi-gear-fill me-2"></i> معلومات التنفيذ</h5>
                                                </div>
                                                <div class="card-body">
                                                    <ul class="list-group list-group-flush">
                                                        <li class="list-group-item">
                                                            <strong>مسار الصفحة:</strong> 
                                                            <code>${page.routePath}</code>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <strong>القالب المستخدم:</strong> 
                                                            ${page.usedTemplates.join(', ')}
                                                        </li>
                                                        <li class="list-group-item">
                                                            <strong>الإجراءات:</strong> 
                                                            <ul class="mb-0 mt-1">
                                                                ${page.actions.map(action => `
                                                                <li>${action}</li>
                                                                `).join('')}
                                                            </ul>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <strong>الوقت المقدر:</strong> 
                                                            <span class="badge bg-secondary">${page.estimatedHours} ساعة</span>
                                                        </li>
                                                        <li class="list-group-item">
                                                            <strong>الجاهزية:</strong> 
                                                            <div class="progress mt-1">
                                                                <div class="progress-bar bg-${
                                                                    page.readinessPercentage >= 80 ? 'success' : 
                                                                    page.readinessPercentage >= 40 ? 'warning' : 'danger'}" 
                                                                    role="progressbar" style="width: ${page.readinessPercentage}%">
                                                                    ${page.readinessPercentage}%
                                                                </div>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-grid"></i> المكونات المشتركة</h3>
            <div class="row">
                ${componentData.sharedComponents.map((component, index) => `
                <div class="col-md-4 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h5 class="mb-0">${component.name}</h5>
                        </div>
                        <div class="card-body">
                            <p>${component.description}</p>
                            <h6 class="text-muted mb-2">الاستخدامات:</h6>
                            <ul class="mb-3">
                                ${component.usages.map(usage => `
                                <li>${usage}</li>
                                `).join('')}
                            </ul>
                            
                            <h6 class="text-muted mb-2">خصائص المكون:</h6>
                            <div class="table-responsive">
                                <table class="table table-sm table-bordered">
                                    <thead>
                                        <tr>
                                            <th>الخاصية</th>
                                            <th>الوصف</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${component.properties.map(prop => `
                                        <tr>
                                            <td><code>${prop.name}</code></td>
                                            <td>${prop.description}</td>
                                        </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer bg-light">
                            <code>${component.viewFile}</code>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-paint-bucket"></i> التصميم والألوان</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <h5><i class="bi bi-palette2"></i> نظام الألوان</h5>
                            <div class="row">
                                ${componentData.designSystem.colors.map(color => `
                                <div class="col-md-4 mb-2">
                                    <div class="card">
                                        <div class="card-body p-2 text-center">
                                            <div style="background-color: ${color.hex}; height: 50px; border-radius: 5px;"></div>
                                            <p class="mt-2 mb-0 small">${color.name}</p>
                                            <code class="small">${color.hex}</code>
                                        </div>
                                    </div>
                                </div>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="col-md-6">
                            <h5><i class="bi bi-type"></i> الخطوط</h5>
                            <div class="row">
                                ${componentData.designSystem.typography.map(font => `
                                <div class="col-md-6 mb-3">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">${font.name}</h6>
                                            <p style="font-family: ${font.fontFamily};">نموذج من الخط المستخدم</p>
                                            <small>الاستخدام: ${font.usage}</small>
                                        </div>
                                    </div>
                                </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                    
                    <div class="row mt-3">
                        <div class="col-md-12">
                            <h5><i class="bi bi-stars"></i> الأيقونات والرسومات</h5>
                            <div class="card">
                                <div class="card-body">
                                    <p>${componentData.designSystem.iconography.description}</p>
                                    <div class="d-flex flex-wrap">
                                        ${componentData.designSystem.iconography.iconSets.map(set => `
                                        <div class="me-3 mb-3">
                                            <span class="badge bg-secondary">${set}</span>
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
            <h3><i class="bi bi-phone"></i> التجاوب مع أحجام الشاشات</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped table-hover">
                            <thead>
                                <tr>
                                    <th>حجم الشاشة</th>
                                    <th>النطاق</th>
                                    <th>التخطيط</th>
                                    <th>ملاحظات</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${componentData.responsive.breakpoints.map(bp => `
                                <tr>
                                    <td><strong>${bp.name}</strong></td>
                                    <td>${bp.range}</td>
                                    <td>${bp.layout}</td>
                                    <td>${bp.notes}</td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    
                    <div class="alert alert-info mt-3">
                        <i class="bi bi-info-circle-fill me-2"></i>
                        ${componentData.responsive.description}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    return html;
} 