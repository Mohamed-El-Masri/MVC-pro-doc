/**
 * وحدة معالجة ملف نظرة عامة على المشروع
 */

/**
 * تحميل بيانات نظرة عامة على المشروع
 * @returns {Promise} - وعد يحتوي على بيانات المشروع
 */
export async function loadProjectOverview() {
    try {
        const response = await fetch('doc/project_overview.json');
        if (!response.ok) {
            throw new Error(`فشل تحميل ملف نظرة عامة المشروع: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('خطأ في تحميل بيانات نظرة عامة المشروع:', error);
        throw error;
    }
}

/**
 * معالجة وعرض بيانات نظرة عامة على المشروع
 * @param {Object} data - بيانات نظرة عامة المشروع
 * @returns {string} - HTML لعرض نظرة عامة المشروع
 */
export function renderProjectOverview(data) {
    let html = `
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><i class="bi bi-info-circle"></i> نظرة عامة على المشروع</h1>
    </div>
    
    <div class="doc-content">
        <div class="doc-section">
            <h3><i class="bi bi-briefcase"></i> تعريف المشروع</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <h5 class="card-title">${data.projectName}</h5>
                    <p class="lead">${data.projectDescription}</p>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-bullseye"></i> أهداف المشروع</h3>
            <div class="row">
                ${data.projectGoals.map((goal, index) => `
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title"><span class="badge bg-primary rounded-pill me-2">${index + 1}</span> ${goal}</h5>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-people"></i> الجمهور المستهدف</h3>
            <div class="row">
                ${data.targetAudience.map(audience => `
                <div class="col-md-4 mb-3">
                    <div class="card text-center h-100">
                        <div class="card-body">
                            <i class="bi bi-person-circle fs-1 text-primary mb-3"></i>
                            <h5 class="card-title">${audience}</h5>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-star"></i> نقاط البيع الفريدة</h3>
            <div class="row">
                ${data.uniqueSellingPoints.map((point, index) => `
                <div class="col-md-6 mb-3">
                    <div class="card h-100">
                        <div class="card-body d-flex">
                            <div class="feature-icon me-3">
                                <span class="badge bg-primary rounded-circle p-3">
                                    <i class="bi bi-${index + 1}-circle"></i>
                                </span>
                            </div>
                            <div>
                                <h5 class="card-title">${point}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-code-slash"></i> التقنيات المستخدمة</h3>
            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h5 class="mb-0"><i class="bi bi-window text-primary me-2"></i> الواجهة الأمامية</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex flex-wrap">
                                ${data.technologies.frontend.map(tech => `
                                <span class="badge bg-secondary me-2 mb-2">${tech}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h5 class="mb-0"><i class="bi bi-cpu text-primary me-2"></i> الخلفية</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex flex-wrap">
                                ${data.technologies.backend.map(tech => `
                                <span class="badge bg-secondary me-2 mb-2">${tech}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h5 class="mb-0"><i class="bi bi-hdd-network text-primary me-2"></i> واجهات API</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex flex-wrap">
                                ${data.technologies.apis.map(api => `
                                <span class="badge bg-secondary me-2 mb-2">${api}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6 mb-4">
                    <div class="card h-100">
                        <div class="card-header bg-light">
                            <h5 class="mb-0"><i class="bi bi-shield-lock text-primary me-2"></i> الأمان</h5>
                        </div>
                        <div class="card-body">
                            <div class="d-flex flex-wrap">
                                ${data.technologies.security.map(sec => `
                                <span class="badge bg-secondary me-2 mb-2">${sec}</span>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-diagram-3"></i> هيكل النظام</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <h5><i class="bi bi-database text-primary me-2"></i> طبقة قاعدة البيانات</h5>
                            <p>${data.systemArchitecture.databaseLayer}</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h5><i class="bi bi-gear text-primary me-2"></i> طبقة منطق الأعمال</h5>
                            <p>${data.systemArchitecture.businessLogicLayer}</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h5><i class="bi bi-window text-primary me-2"></i> طبقة العرض</h5>
                            <p>${data.systemArchitecture.presentationLayer}</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h5><i class="bi bi-broadcast text-primary me-2"></i> طبقة الوقت الفعلي</h5>
                            <p>${data.systemArchitecture.realtimeLayer}</p>
                        </div>
                        <div class="col-md-6 mb-3">
                            <h5><i class="bi bi-shield text-primary me-2"></i> طبقة الأمان</h5>
                            <p>${data.systemArchitecture.securityLayer}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-check2-all"></i> أولويات التطوير</h3>
            <div class="row">
                <div class="col-md-4 mb-3">
                    <div class="card phase-card phase-1 h-100">
                        <div class="card-body">
                            <div class="phase-icon"><i class="bi bi-1-circle"></i></div>
                            <h5 class="card-title">المرحلة الأولى</h5>
                            <ul class="list-unstyled mb-0">
                                ${data.developmentPriorities.phase1.map(priority => `
                                <li><i class="bi bi-check-circle text-success me-2"></i>${priority}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card phase-card phase-2 h-100">
                        <div class="card-body">
                            <div class="phase-icon"><i class="bi bi-2-circle"></i></div>
                            <h5 class="card-title">المرحلة الثانية</h5>
                            <ul class="list-unstyled mb-0">
                                ${data.developmentPriorities.phase2.map(priority => `
                                <li><i class="bi bi-check-circle text-success me-2"></i>${priority}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-4 mb-3">
                    <div class="card phase-card phase-3 h-100">
                        <div class="card-body">
                            <div class="phase-icon"><i class="bi bi-3-circle"></i></div>
                            <h5 class="card-title">المرحلة الثالثة</h5>
                            <ul class="list-unstyled mb-0">
                                ${data.developmentPriorities.phase3.map(priority => `
                                <li><i class="bi bi-check-circle text-success me-2"></i>${priority}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card phase-card phase-4 h-100">
                        <div class="card-body">
                            <div class="phase-icon"><i class="bi bi-4-circle"></i></div>
                            <h5 class="card-title">المرحلة الرابعة</h5>
                            <ul class="list-unstyled mb-0">
                                ${data.developmentPriorities.phase4.map(priority => `
                                <li><i class="bi bi-check-circle text-success me-2"></i>${priority}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 mb-3">
                    <div class="card phase-card phase-5 h-100">
                        <div class="card-body">
                            <div class="phase-icon"><i class="bi bi-5-circle"></i></div>
                            <h5 class="card-title">المرحلة الخامسة</h5>
                            <ul class="list-unstyled mb-0">
                                ${data.developmentPriorities.phase5.map(priority => `
                                <li><i class="bi bi-check-circle text-success me-2"></i>${priority}</li>
                                `).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    return html;
} 