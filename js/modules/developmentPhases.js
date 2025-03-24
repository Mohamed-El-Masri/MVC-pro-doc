/**
 * وحدة معالجة ملف مراحل التطوير
 */

/**
 * تحميل بيانات مراحل التطوير
 * @returns {Promise} - وعد يحتوي على بيانات مراحل التطوير
 */
export async function loadDevelopmentPhases() {
    try {
        const response = await fetch('doc/development_phases.json');
        if (!response.ok) {
            throw new Error(`فشل تحميل ملف مراحل التطوير: ${response.status}`);
        }
        const data = await response.json();
        
        // تهيئة البيانات بالشكل المناسب للعرض
        if (data && Array.isArray(data.projectPhases)) {
            // تحويل هيكل البيانات ليناسب الواجهة
            data.developmentPhases = {
                overview: "يتم تطوير مشروع Vyrlo على مدار 17 يومًا موزعة على خمس مراحل رئيسية، تبدأ من إعداد البنية التحتية والقاعدة وتنتهي بالاختبار والإطلاق.",
                totalDuration: "17 يوم",
                totalTasks: data.projectPhases.reduce((total, phase) => total + phase.tasks.length, 0),
                phases: data.projectPhases.map(phase => {
                    // تحديد أيام البداية والنهاية بناءً على ترتيب المراحل
                    let startWeek = 1;
                    if (phase.phaseNumber > 1) {
                        // حساب بسيط للأيام بناءً على المراحل السابقة
                        // (في الواقع يجب أن يكون هذا في البيانات، لكننا نقوم بتقدير بسيط هنا)
                        startWeek = (phase.phaseNumber - 1) * 3 + 1;
                    }
                    
                    // استخراج عدد الأيام من النص
                    const durationMatch = phase.estimatedDuration.match(/(\d+)/);
                    const durationWeeks = durationMatch ? parseInt(durationMatch[1]) : 3;
                    const endWeek = startWeek + durationWeeks - 1;
                    
                    return {
                        name: phase.phaseName,
                        description: phase.description,
                        duration: phase.estimatedDuration,
                        startWeek: startWeek,
                        endWeek: endWeek,
                        effortPercentage: Math.round(durationWeeks / 17 * 100), // تقدير كنسبة مئوية من المدة الإجمالية
                        goals: phase.tasks.slice(0, 3).map(task => task.taskName), // استخدام أول 3 مهام كأهداف
                        tasks: phase.tasks.map(task => ({
                            name: task.taskName,
                            description: task.description,
                            priority: task.priority,
                            estimatedHours: task.estimatedHours,
                            assignedTo: task.assignedTo || "غير محدد" // في حالة عدم وجود تعيين
                        })),
                        dependencies: [phase.dependencies],
                        deliverables: phase.tasks.map(task => `${task.taskName} (${task.estimatedHours} ساعة)`)
                    };
                }),
                risks: [
                    {
                        name: "تأخر في تسليم المراحل",
                        impact: "مرتفع",
                        probability: "متوسطة",
                        mitigation: "تطبيق إدارة أجايل وقياس التقدم بشكل يومي"
                    },
                    {
                        name: "مشاكل تكامل التقنيات",
                        impact: "متوسط",
                        probability: "متوسطة",
                        mitigation: "إجراء اختبارات تكامل مبكرة وبناء واجهات مجردة"
                    },
                    {
                        name: "أخطاء أمان أو أداء",
                        impact: "مرتفع",
                        probability: "منخفضة",
                        mitigation: "مراجعة الكود واختبارات الأمان والأداء الدورية"
                    }
                ],
                resources: [
                    {
                        name: "فريق تطوير",
                        type: "بشرية",
                        description: "5 مطورين بمهارات متنوعة في Front-end و Back-end وقواعد البيانات"
                    },
                    {
                        name: "خوادم تطوير",
                        type: "تقنية",
                        description: "خوادم محلية وسحابية لبيئات التطوير والاختبار والإنتاج"
                    },
                    {
                        name: "أدوات التطوير",
                        type: "برمجية",
                        description: "Visual Studio، إدارة المهام، أدوات التحكم بالنسخ والاختبار"
                    }
                ]
            };
        }
        
        return data;
    } catch (error) {
        console.error('خطأ في تحميل بيانات مراحل التطوير:', error);
        throw error;
    }
}

/**
 * معالجة وعرض بيانات مراحل التطوير
 * @param {Object} data - بيانات مراحل التطوير
 * @returns {string} - HTML لعرض مراحل التطوير
 */
export function renderDevelopmentPhases(data) {
    if (!data || !data.developmentPhases) {
        return `<div class="alert alert-warning"><i class="bi bi-exclamation-triangle"></i> لا توجد بيانات لمراحل التطوير</div>`;
    }

    const phaseColors = ["primary", "success", "warning", "info", "danger"];
    const phaseIcons = ["diagram-3", "window", "cpu", "chat", "check-circle"];
    
    let html = `
    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 class="h2"><i class="bi bi-calendar4-range"></i> مراحل تطوير المشروع</h1>
    </div>
    
    <div class="doc-content">
        <div class="doc-section">
            <h3><i class="bi bi-info-circle"></i> نظرة عامة</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <p class="lead">${data.developmentPhases.overview}</p>
                    <div class="row mt-4">
                        <div class="col-md-4">
                            <div class="card text-center mb-3">
                                <div class="card-body">
                                    <i class="bi bi-calendar3 text-primary fs-1 mb-3"></i>
                                    <h5>المدة الإجمالية</h5>
                                    <p class="h3 text-primary">${data.developmentPhases.totalDuration}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-center mb-3">
                                <div class="card-body">
                                    <i class="bi bi-layers text-success fs-1 mb-3"></i>
                                    <h5>عدد المراحل</h5>
                                    <p class="h3 text-success">${data.developmentPhases.phases.length}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="card text-center mb-3">
                                <div class="card-body">
                                    <i class="bi bi-check2-all text-info fs-1 mb-3"></i>
                                    <h5>إجمالي المهام</h5>
                                    <p class="h3 text-info">${data.developmentPhases.totalTasks}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-layers"></i> المراحل التفصيلية</h3>
            
            <div class="d-flex justify-content-center mb-4">
                <div class="btn-group" role="group">
                    <button type="button" class="btn btn-outline-primary active" id="btn-phases-timeline">
                        <i class="bi bi-calendar4-week"></i> الجدول الزمني
                    </button>
                    <button type="button" class="btn btn-outline-primary" id="btn-phases-details">
                        <i class="bi bi-list-check"></i> تفاصيل المهام
                    </button>
                </div>
            </div>
            
            <div id="phases-timeline" class="mb-5">
                <div class="timeline-container">
                    ${data.developmentPhases.phases.map((phase, index) => `
                    <div class="phase-timeline-item phase-${index + 1}">
                        <div class="phase-timeline-marker">
                            <span class="badge rounded-pill bg-${phaseColors[index % phaseColors.length]}">
                                <i class="bi bi-${index + 1}-circle"></i>
                            </span>
                        </div>
                        <div class="card phase-timeline-content">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0"><i class="bi bi-${phaseIcons[index % phaseIcons.length]}"></i> ${phase.name}</h5>
                                <span class="badge bg-${phaseColors[index % phaseColors.length]}">${phase.duration}</span>
                            </div>
                            <div class="card-body">
                                <p>${phase.description}</p>
                                <h6 class="mt-3"><i class="bi bi-check-circle"></i> الأهداف الرئيسية:</h6>
                                <ul class="mb-0">
                                    ${phase.goals.map(goal => `<li>${goal}</li>`).join('')}
                                </ul>
                            </div>
                            <div class="card-footer text-muted">
                                <small><i class="bi bi-clock-history"></i> الأيام ${phase.startWeek} إلى ${phase.endWeek}</small>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
            
            <div id="phases-details" class="d-none">
                <div class="accordion" id="phasesAccordion">
                    ${data.developmentPhases.phases.map((phase, index) => `
                    <div class="accordion-item">
                        <h2 class="accordion-header" id="heading${index}">
                            <button class="accordion-button ${index !== 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}" aria-expanded="${index === 0 ? 'true' : 'false'}" aria-controls="collapse${index}">
                                <i class="bi bi-${index + 1}-circle me-2 text-${phaseColors[index % phaseColors.length]}"></i>
                                <strong>${phase.name}</strong> <span class="badge bg-${phaseColors[index % phaseColors.length]} ms-3">${phase.duration}</span>
                            </button>
                        </h2>
                        <div id="collapse${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" aria-labelledby="heading${index}" data-bs-parent="#phasesAccordion">
                            <div class="accordion-body">
                                <div class="mb-4">
                                    <h5><i class="bi bi-info-circle text-${phaseColors[index % phaseColors.length]}"></i> وصف المرحلة</h5>
                                    <p>${phase.description}</p>
                                </div>
                                
                                <div class="mb-4">
                                    <h5><i class="bi bi-list-check text-${phaseColors[index % phaseColors.length]}"></i> المهام التفصيلية</h5>
                                    <div class="table-responsive">
                                        <table class="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">المهمة</th>
                                                    <th scope="col">الأهمية</th>
                                                    <th scope="col">المدة المقدرة</th>
                                                    <th scope="col">المسؤول</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${phase.tasks.map((task, taskIndex) => `
                                                <tr>
                                                    <th scope="row">${taskIndex + 1}</th>
                                                    <td>
                                                        <strong>${task.name}</strong>
                                                        <div><small class="text-muted">${task.description || ''}</small></div>
                                                    </td>
                                                    <td><span class="badge bg-${task.priority === 'عالية' ? 'danger' : task.priority === 'متوسطة' ? 'warning' : 'info'}">${task.priority}</span></td>
                                                    <td>${task.estimatedHours} ساعة</td>
                                                    <td>${task.assignedTo}</td>
                                                </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                <div class="mb-4">
                                    <h5><i class="bi bi-journal-check text-${phaseColors[index % phaseColors.length]}"></i> نتائج المرحلة</h5>
                                    <ul class="list-group">
                                        ${phase.deliverables.map(deliverable => `
                                        <li class="list-group-item d-flex justify-content-between align-items-center">
                                            ${deliverable}
                                            <span><i class="bi bi-check-circle-fill text-success"></i></span>
                                        </li>
                                        `).join('')}
                                    </ul>
                                </div>
                                
                                <div>
                                    <h5><i class="bi bi-link-45deg text-${phaseColors[index % phaseColors.length]}"></i> الاعتمادات</h5>
                                    <div class="alert alert-light">
                                        <strong>المتطلبات السابقة:</strong> ${phase.dependencies.join(', ') || 'لا يوجد'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-bar-chart"></i> توزيع الجهد على المراحل</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="chart-container mb-4">
                        <div class="progress-stacked" style="height: 30px;">
                            ${data.developmentPhases.phases.map((phase, index) => {
                                const percentage = phase.effortPercentage || Math.round(100 / data.developmentPhases.phases.length);
                                return `<div class="progress" role="progressbar" style="width: ${percentage}%">
                                    <div class="progress-bar bg-${phaseColors[index % phaseColors.length]}" title="${phase.name}: ${percentage}%">${percentage}%</div>
                                </div>`;
                            }).join('')}
                        </div>
                    </div>
                    <div class="row">
                        ${data.developmentPhases.phases.map((phase, index) => `
                        <div class="col-md-4 mb-3">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title text-${phaseColors[index % phaseColors.length]}">
                                        <i class="bi bi-${index + 1}-circle"></i> ${phase.name}
                                    </h5>
                                    <div class="mt-3">
                                        <div><strong>المدة:</strong> ${phase.duration}</div>
                                        <div><strong>عدد المهام:</strong> ${phase.tasks.length}</div>
                                        <div><strong>إجمالي الساعات:</strong> ${phase.tasks.reduce((total, task) => total + (task.estimatedHours || 0), 0)} ساعة</div>
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
            <h3><i class="bi bi-exclamation-triangle"></i> المخاطر والتحديات</h3>
            <div class="card shadow-sm mb-4">
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-striped">
                            <thead>
                                <tr>
                                    <th scope="col">المخاطرة</th>
                                    <th scope="col">الأثر</th>
                                    <th scope="col">الاحتمالية</th>
                                    <th scope="col">الإجراءات الوقائية</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.developmentPhases.risks.map(risk => `
                                <tr>
                                    <td><strong>${risk.name}</strong></td>
                                    <td>
                                        <span class="badge bg-${risk.impact === 'مرتفع' ? 'danger' : risk.impact === 'متوسط' ? 'warning' : 'success'}">${risk.impact}</span>
                                    </td>
                                    <td>
                                        <span class="badge bg-${risk.probability === 'مرتفعة' ? 'danger' : risk.probability === 'متوسطة' ? 'warning' : 'success'}">${risk.probability}</span>
                                    </td>
                                    <td>${risk.mitigation}</td>
                                </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="doc-section">
            <h3><i class="bi bi-journals"></i> المصادر والموارد</h3>
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="row">
                        ${data.developmentPhases.resources.map(resource => `
                        <div class="col-md-6 mb-3">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title">
                                        <i class="bi bi-${resource.type === 'بشرية' ? 'people' : resource.type === 'برمجية' ? 'code-square' : 'pc-display'} text-primary"></i>
                                        ${resource.name}
                                    </h5>
                                    <p>${resource.description}</p>
                                </div>
                                <div class="card-footer bg-light">
                                    <small class="text-muted">النوع: ${resource.type}</small>
                                </div>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    
    return html;
} 