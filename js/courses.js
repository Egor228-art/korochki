document.addEventListener('DOMContentLoaded', async () => {
    await renderCourses();
});

async function renderCourses() {
    const courses = await getAllCourses();
    const container = document.getElementById('coursesList');
    if (!container) return;
    if (courses.length === 0) { container.innerHTML = '<p>Курсы не найдены</p>'; return; }
    let html = '<div class="course-full-list">';
    for (let course of courses) {
        html += `<div class="course-full-card"><div class="course-full-header"><h3>${escapeHtml(course.name)}</h3><span class="course-level level-${course.level.toLowerCase()}">${course.level}</span></div>`;
        html += `<div class="course-full-body"><p class="course-description">Курс "${course.name}"</p><div class="course-details"><div class="course-detail"><span class="detail-label">Длительность:</span><span class="detail-value">${course.hours} часов</span></div>`;
        html += `<div class="course-detail"><span class="detail-label">Стоимость:</span><span class="detail-value">${course.price.toLocaleString()} ₽</span></div></div></div>`;
        html += `<div class="course-full-footer"><button class="btn" onclick="applyForCourse('${escapeHtml(course.name)}')">Оставить заявку</button></div></div>`;
    }
    html += '</div>';
    container.innerHTML = html;
}

function applyForCourse(courseName) {
    const user = sessionStorage.getItem('user');
    if (!user) { alert('Для подачи заявки войдите в систему'); window.location.href = 'login.html'; return; }
    localStorage.setItem('selectedCourse', courseName);
    window.location.href = 'application_form.html';
}