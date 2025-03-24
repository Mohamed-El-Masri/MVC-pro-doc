/**
 * وحدة معالجة ملف نماذج قاعدة البيانات
 */

/**
 * تحميل بيانات نماذج قاعدة البيانات
 * @returns {Promise} - وعد يحتوي على بيانات نماذج قاعدة البيانات
 */
export async function loadDatabaseModels() {
    try {
        const response = await fetch('doc/database_models.json');
        if (!response.ok) {
            throw new Error(`فشل تحميل ملف نماذج قاعدة البيانات: ${response.status}`);
        }
        const data = await response.json();
        
        // تهيئة البيانات بشكل صحيح للعرض
        if (data && Array.isArray(data.databaseModels)) {
            // تحويل هيكل البيانات ليناسب الواجهة
            data.formattedData = {
                overview: "قاعدة بيانات تطبيق Vyrlo تتكون من مجموعة من الجداول المترابطة التي تخزن جميع المعلومات الضرورية للمستخدمين والخدمات والتفاعلات",
                databaseType: "SQL Server",
                models: data.databaseModels,
                developmentApproach: {
                    description: "تم استخدام نهج Code First مع Entity Framework لتطوير قاعدة البيانات",
                    steps: ["تصميم النماذج وتحديد العلاقات", "تطبيق Annotations والتكوين", "إنشاء الترحيلات", "إنشاء قاعدة البيانات"]
                },
                performanceOptimization: {
                    indexes: [
                        {
                            name: "فهرس خصائص الخدمات",
                            description: "فهرس متعدد العمود على خصائص الخدمات للبحث السريع"
                        },
                        {
                            name: "فهرس موقع الخدمة",
                            description: "فهرس مكاني لتسريع البحث بناءً على الموقع"
                        }
                    ],
                    caching: [
                        {
                            strategy: "تخزين البيانات المشتركة",
                            description: "تخزين البيانات المشتركة مثل فئات الخدمات والمناطق"
                        },
                        {
                            strategy: "التخزين المؤقت للاستعلامات",
                            description: "تخزين نتائج الاستعلامات المتكررة لتحسين الأداء"
                        }
                    ]
                }
            };
        }
        
        return data;
    } catch (error) {
        console.error('خطأ في تحميل بيانات نماذج قاعدة البيانات:', error);
        throw error;
    }
}

/**
 * معالجة وعرض بيانات نماذج قاعدة البيانات
 * @param {Object} data - بيانات نماذج قاعدة البيانات
 * @returns {string} - HTML لعرض نماذج قاعدة البيانات
 */
export function renderDatabaseModels(data) {
    // التحقق من أن البيانات موجودة وبالصيغة الصحيحة
    if (!data || (!data.formattedData && !Array.isArray(data.databaseModels))) {
        return `<div class="alert alert-warning"><i class="bi bi-exclamation-triangle"></i> لا توجد بيانات لنماذج قاعدة البيانات</div>`;
    }

    // استخدام البنية المعدلة للبيانات أو البيانات الأصلية
    const models = data.formattedData ? data.formattedData.models : data.databaseModels;
    const overview = data.formattedData ? data.formattedData.overview : "نماذج قاعدة بيانات المشروع";
    const dbType = data.formattedData ? data.formattedData.databaseType : "SQL Server";
    const devApproach = data.formattedData ? data.formattedData.developmentApproach : { description: "", steps: [] };
    const perfOpt = data.formattedData ? data.formattedData.performanceOptimization : { indexes: [], caching: [] };

    let html = `
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><i class="bi bi-diagram-3"></i> نماذج قاعدة البيانات</h1>
    </div>
    
    <div class="doc-content">
        <div class="doc-section">
            <h3><i class="bi bi-info-circle"></i> نظرة عامة</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <p class="lead">${overview}</p>
                    
                    <div class="row mt-4">
                        <div class="col-md-4">
                            <div class="card text-center mb-3">
                                <div class="card-body">
                                    <i class="bi bi-table text-primary fs-1 mb-3"></i>
                                    <h5>عدد النماذج</h5>
                                    <p class="h3 text-primary">${models.length}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-center mb-3">
                                <div class="card-body">
                                    <i class="bi bi-link-45deg text-success fs-1 mb-3"></i>
                                    <h5>العلاقات</h5>
                                    <p class="h3 text-success">${countRelationships(models)}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-center mb-3">
                                <div class="card-body">
                                    <i class="bi bi-database-check text-info fs-1 mb-3"></i>
                                    <h5>نوع قاعدة البيانات</h5>
                                    <p class="h3 text-info">${dbType}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3><i class="bi bi-table"></i> النماذج الرئيسية</h3>
                <div class="input-group" style="max-width: 300px">
                    <span class="input-group-text"><i class="bi bi-search"></i></span>
                    <input type="text" class="form-control" id="db-models-search" placeholder="بحث في النماذج...">
                </div>
            </div>
            
            <div class="accordion" id="dbModelAccordion">
                ${models.map((model, index) => `
                <div class="accordion-item model-item" data-model-name="${model.modelName ? model.modelName.toLowerCase() : 'model'}">
                    <h2 class="accordion-header" id="heading${index}">
                        <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" 
                                data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" 
                                aria-controls="collapse${index}">
                            <i class="bi bi-table-fill me-2 text-primary"></i>
                            <strong>${model.modelName || model.name}</strong>
                            <span class="badge bg-secondary ms-2">${(model.properties || model.fields || []).length} خاصية</span>
                            <span class="badge bg-info ms-2">${(model.relationships || []).length} علاقة</span>
                        </button>
                    </h2>
                    <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" 
                         aria-labelledby="heading${index}" data-bs-parent="#dbModelAccordion">
                        <div class="accordion-body">
                            <div class="mb-4">
                                <h5><i class="bi bi-info-circle"></i> وصف النموذج</h5>
                                <p>${model.description || ''}</p>
                                ${model.tableName ? `<p><strong>اسم الجدول:</strong> ${model.tableName}</p>` : ''}
                            </div>
                            
                            <div class="mb-4">
                                <h5><i class="bi bi-key"></i> الخصائص</h5>
                                <div class="table-responsive">
                                    <table class="table table-striped table-hover">
                                        <thead>
                                            <tr>
                                                <th>الاسم</th>
                                                <th>النوع</th>
                                                <th>الوصف</th>
                                                <th>سمات إضافية</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${(model.properties || model.fields || []).map(prop => `
                                            <tr>
                                                <td>
                                                    <strong>${prop.name}</strong>
                                                    ${prop.isPrimaryKey ? '<span class="badge bg-primary ms-2">Primary Key</span>' : ''}
                                                    ${prop.isForeignKey ? '<span class="badge bg-success ms-2">Foreign Key</span>' : ''}
                                                </td>
                                                <td><code>${prop.type}</code></td>
                                                <td>${prop.description || ''}</td>
                                                <td>
                                                    ${prop.isRequired ? '<span class="badge bg-danger me-1">Required</span>' : ''}
                                                    ${prop.isUnique ? '<span class="badge bg-warning me-1">Unique</span>' : ''}
                                                    ${prop.defaultValue ? `<span class="badge bg-info me-1">Default: ${prop.defaultValue}</span>` : ''}
                                                    ${prop.maxLength ? `<span class="badge bg-secondary me-1">Max: ${prop.maxLength}</span>` : ''}
                                                </td>
                                            </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            
                            ${model.relationships && model.relationships.length > 0 ? `
                            <div class="mb-4">
                                <h5><i class="bi bi-link-45deg"></i> العلاقات</h5>
                                <div class="row">
                                    ${model.relationships.map(rel => `
                                    <div class="col-md-6 mb-3">
                                        <div class="card h-100">
                                            <div class="card-body">
                                                <h5 class="card-title">
                                                    <i class="bi bi-arrow-left-right text-primary me-2"></i>
                                                    علاقة مع <strong>${rel.relatedModel}</strong>
                                                </h5>
                                                <div class="mt-2">
                                                    <div><strong>نوع العلاقة:</strong> <span class="badge bg-info">${rel.type}</span></div>
                                                    <div><strong>الوصف:</strong> ${rel.description || ''}</div>
                                                    <div><strong>مفتاح العلاقة:</strong> ${rel.foreignKey || ''}</div>
                                                    <div><strong>سلوك الحذف:</strong> <span class="badge bg-warning">${rel.onDelete || 'No Action'}</span></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    `).join('')}
                                </div>
                            </div>
                            ` : ''}
                            
                            ${model.validations && model.validations.length > 0 ? `
                            <div class="mb-4">
                                <h5><i class="bi bi-check-square"></i> قواعد التحقق</h5>
                                <ul class="list-group">
                                    ${model.validations.map(validation => `
                                    <li class="list-group-item">
                                        <div class="d-flex justify-content-between">
                                            <span>
                                                <i class="bi bi-check-circle-fill text-success me-2"></i>
                                                <strong>${validation.field || validation.property}:</strong> 
                                                ${Array.isArray(validation.rules) ? validation.rules.join(', ') : validation.rule}
                                            </span>
                                            <span class="badge bg-primary">${validation.type || 'Validation'}</span>
                                        </div>
                                        <small class="text-muted">${validation.description || ''}</small>
                                    </li>
                                    `).join('')}
                                </ul>
                            </div>
                            ` : ''}
                            
                            ${model.entityFrameworkConfiguration ? `
                            <div>
                                <h5><i class="bi bi-gear"></i> تكوين Entity Framework</h5>
                                <div class="card">
                                    <div class="card-body">
                                        <pre class="mb-0"><code>${model.entityFrameworkConfiguration}</code></pre>
                                    </div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-diagram-3"></i> مخطط العلاقات</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="text-center">
                        <p class="mb-4">مخطط العلاقات بين نماذج قاعدة البيانات</p>
                        <div class="relationships-diagram">
                            <div class="row justify-content-center">
                                ${models.map((model, index) => `
                                <div class="col-md-3 col-sm-6 mb-4">
                                    <div class="card model-card">
                                        <div class="card-header bg-primary text-white">
                                            <h5 class="mb-0">${model.modelName || model.name}</h5>
                                        </div>
                                        <div class="card-body">
                                            <small class="text-muted">علاقات مع:</small>
                                            <ul class="list-unstyled mb-0 mt-2">
                                                ${model.relationships && model.relationships.length > 0 
                                                    ? model.relationships.map(rel => `
                                                        <li>
                                                            <i class="bi bi-arrow-right me-1"></i> ${rel.relatedModel}
                                                            <small class="text-muted">(${rel.type})</small>
                                                        </li>`).join('') 
                                                    : '<li class="text-muted">لا توجد علاقات</li>'}
                                            </ul>
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
        
        <div class="doc-section">
            <h3><i class="bi bi-gear"></i> استراتيجيات التنفيذ</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-code-slash text-primary me-2"></i> نهج التطوير</h5>
                                </div>
                                <div class="card-body">
                                    <p>${devApproach.description}</p>
                                    <div class="mt-3">
                                        <h6>الخطوات المتبعة:</h6>
                                        <ol>
                                            ${devApproach.steps.map(step => `
                                            <li>${step}</li>
                                            `).join('')}
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="col-md-6 mb-3">
                            <div class="card h-100">
                                <div class="card-header bg-light">
                                    <h5 class="mb-0"><i class="bi bi-speedometer text-primary me-2"></i> تحسين الأداء</h5>
                                </div>
                                <div class="card-body">
                                    <div class="mb-3">
                                        <h6>أنواع الفهارس:</h6>
                                        <ul>
                                            ${perfOpt.indexes && perfOpt.indexes.length > 0
                                                ? perfOpt.indexes.map(index => `
                                                <li><strong>${index.name}:</strong> ${index.description}</li>
                                                `).join('') 
                                                : '<li>غير متوفر</li>'}
                                        </ul>
                                    </div>
                                    
                                    <div class="mb-3">
                                        <h6>استراتيجيات التخزين المؤقت:</h6>
                                        <ul>
                                            ${perfOpt.caching && perfOpt.caching.length > 0
                                                ? perfOpt.caching.map(cache => `
                                                <li><strong>${cache.strategy}:</strong> ${cache.description}</li>
                                                `).join('') 
                                                : '<li>غير متوفر</li>'}
                                        </ul>
                                    </div>
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

/**
 * حساب إجمالي عدد العلاقات بين النماذج
 * @param {Array} models - قائمة النماذج
 * @returns {number} - عدد العلاقات
 */
function countRelationships(models) {
    let count = 0;
    if (models && models.length > 0) {
        models.forEach(model => {
            if (model.relationships && model.relationships.length > 0) {
                count += model.relationships.length;
            }
        });
    }
    return count;
} 