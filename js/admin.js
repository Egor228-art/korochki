let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = checkAuth();
    if (!currentUser || !currentUser.is_admin) {
        alert('Доступ запрещён');
        window.location.href = 'login.html';
        return;
    }
    
    await loadUsers();
    await loadCourses();
    await loadApplications();
    
    document.getElementById('logoutLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    
    // Модалки
    document.getElementById('showAddAdminBtn').onclick = () => openModal('addAdminModal');
    document.getElementById('closeAdminModal').onclick = () => closeModal('addAdminModal');
    document.getElementById('showAddCourseBtn').onclick = () => openModal('addCourseModal');
    document.getElementById('closeCourseModal').onclick = () => closeModal('addCourseModal');
    
    document.getElementById('addAdminForm').onsubmit = async (e) => {
        e.preventDefault();
        const hashedPass = await hashPassword(document.getElementById('adminPassword').value);
        await addUser({
            login: document.getElementById('adminLogin').value,
            password: hashedPass,
            full_name: document.getElementById('adminFullName').value,
            phone: document.getElementById('adminPhone').value,
            email: document.getElementById('adminEmail').value,
            is_admin: 1
        });
        closeModal('addAdminModal');
        await loadUsers();
        alert('Администратор добавлен');
    };
    
    document.getElementById('addCourseForm').onsubmit = async (e) => {
        e.preventDefault();
        await addCourse({
            name: document.getElementById('courseName').value,
            hours: parseInt(document.getElementById('courseHours').value),
            price: parseInt(document.getElementById('coursePrice').value),
            level: document.getElementById('courseLevel').value
        });
        closeModal('addCourseModal');
        await loadCourses();
        alert('Курс добавлен');
    };
});

async function loadUsers() {
    const users = await getAllUsers();
    const container = document.getElementById('usersList');
    if (!container) return;
    if (users.length === 0) { container.innerHTML = '<p>Нет пользователей</p>'; return; }
    let html = '<div class="table-responsive"><table><thead><tr><th>ID</th><th>Логин</th><th>ФИО</th><th>Админ</th><th></th></tr></thead><tbody>';
    for (let user of users) {
        html += `<tr><td>${user.id}</td><td>${escapeHtml(user.login)}</td><td>${escapeHtml(user.full_name)}</td><td>${user.is_admin ? 'Да' : 'Нет'}</td>`;
        html += `<td>${user.id !== currentUser.id ? `<button class="btn btn-small btn-danger" onclick="deleteUserById(${user.id})">Удалить</button>` : '—'}</td></tr>`;
    }
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

async function loadCourses() {
    const courses = await getAllCourses();
    const container = document.getElementById('coursesList');
    if (!container) return;
    if (courses.length === 0) { container.innerHTML = '<p>Нет курсов</p>'; return; }
    let html = '<div class="table-responsive"><table><thead><tr><th>ID</th><th>Название</th><th>Часов</th><th>Цена</th><th>Уровень</th><th></th></tr></thead><tbody>';
    for (let course of courses) {
        html += `<tr><td>${course.id}</td><td>${escapeHtml(course.name)}</td><td>${course.hours}</td><td>${course.price.toLocaleString()} ₽</td><td>${course.level}</td>`;
        html += `<td><button class="btn btn-small btn-danger" onclick="deleteCourseById(${course.id})">Удалить</button></td></tr>`;
    }
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

async function loadApplications() {
    const apps = await getAllApplications();
    const users = await getAllUsers();
    const userMap = {}; users.forEach(u => userMap[u.id] = u.full_name);
    const container = document.getElementById('applicationsList');
    if (!container) return;
    if (apps.length === 0) { container.innerHTML = '<p>Нет заявок</p>'; return; }
    let html = '<div class="table-responsive"><table><thead><tr><th>ID</th><th>Пользователь</th><th>Курс</th><th>Дата</th><th>Оплата</th><th>Статус</th><th></th></tr></thead><tbody>';
    for (let app of apps) {
        html += `<tr><td>${app.id}</td><td>${escapeHtml(userMap[app.user_id] || '?')}</td><td>${escapeHtml(app.course_name)}</td><td>${app.desired_start_date}</td><td>${app.payment_method === 'cash' ? 'Наличные' : 'Перевод'}</td>`;
        html += `<td><select id="status_${app.id}"><option ${app.status === 'Новая' ? 'selected' : ''}>Новая</option><option ${app.status === 'Идет обучение' ? 'selected' : ''}>Идет обучение</option><option ${app.status === 'Обучение завершено' ? 'selected' : ''}>Обучение завершено</option></select></td>`;
        html += `<td><button class="btn btn-small" onclick="updateStatus(${app.id})">Сохранить</button></td></tr>`;
    }
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

window.updateStatus = async (id) => {
    const select = document.getElementById(`status_${id}`);
    await updateApplicationStatus(id, select.value);
    alert('Статус обновлён');
    await loadApplications();
};

window.deleteUserById = async (id) => {
    if (confirm('Удалить пользователя? Все его заявки и отзывы тоже удалятся.')) {
        await deleteUser(id);
        await loadUsers();
    }
};

window.deleteCourseById = async (id) => {
    if (confirm('Удалить курс?')) {
        await deleteCourse(id);
        await loadCourses();
    }
};

function openModal(id) { document.getElementById(id).style.display = 'flex'; }
function closeModal(id) { document.getElementById(id).style.display = 'none'; }