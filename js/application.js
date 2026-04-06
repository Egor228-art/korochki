let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = checkAuth();
    if (!currentUser) return;
    
    await loadCoursesToSelect();
    
    document.getElementById('logoutLink')?.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    
    document.getElementById('applicationForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const courseName = document.getElementById('courseName').value;
        const startDate = document.getElementById('startDate').value;
        const paymentMethod = document.getElementById('paymentMethod').value;
        
        const today = new Date().toISOString().split('T')[0];
        if (startDate < today) {
            document.getElementById('dateError').textContent = 'Дата не может быть в прошлом';
            return;
        }
        document.getElementById('dateError').textContent = '';
        
        await addApplication({
            user_id: currentUser.id,
            course_name: courseName,
            desired_start_date: startDate,
            payment_method: paymentMethod,
            status: 'Новая'
        });
        
        alert('Заявка направлена администратору');
        window.location.href = 'dashboard.html';
    });
});

async function loadCoursesToSelect() {
    const courses = await getAllCourses();
    const select = document.getElementById('courseName');
    if (!select) return;
    
    select.innerHTML = '<option value="">-- Выберите курс --</option>';
    courses.forEach(course => {
        const option = document.createElement('option');
        option.value = course.name;
        option.textContent = `${course.name} (${course.hours} ч., ${course.price.toLocaleString()} ₽)`;
        select.appendChild(option);
    });
}