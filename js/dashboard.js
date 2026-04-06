let currentUser = null;
let currentAppId = null;

document.addEventListener('DOMContentLoaded', async () => {
    currentUser = checkAuth();
    if (!currentUser) return;
    
    await loadApplications();
    
    document.getElementById('logoutLink').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
    
    document.getElementById('submitReviewBtn').addEventListener('click', async () => {
        const text = document.getElementById('reviewText').value.trim();
        if (!text) {
            alert('Введите текст отзыва');
            return;
        }
        await addReview({
            user_id: currentUser.id,
            application_id: currentAppId,
            review_text: text
        });
        document.getElementById('reviewModal').style.display = 'none';
        await loadApplications();
    });
    
    document.getElementById('closeModalBtn').addEventListener('click', () => {
        document.getElementById('reviewModal').style.display = 'none';
    });
});

async function loadApplications() {
    const apps = await getApplicationsByUser(currentUser.id);
    const allReviews = [];
    for (let app of apps) {
        const review = await getReviewByApplicationId(app.id);
        if (review) allReviews.push(review);
    }
    
    const container = document.getElementById('applicationsList');
    
    if (apps.length === 0) {
        container.innerHTML = '<p>Заявки не найдены</p>';
        return;
    }
    
    let html = '<div class="table-responsive"><table><thead><tr><th>Курс</th><th>Дата начала</th><th>Способ оплаты</th><th>Статус</th><th>Отзыв</th><th></th></tr></thead><tbody>';
    
    for (let app of apps) {
        const review = await getReviewByApplicationId(app.id);
        html += `<tr>
            <td>${escapeHtml(app.course_name)}</td>
            <td>${app.desired_start_date}</td>
            <td>${app.payment_method === 'cash' ? 'Наличные' : 'Перевод по номеру телефона'}</td>
            <td>${app.status}</td>
            <td>${review ? escapeHtml(review.review_text) : '—'}</td>
            <td>`;
        if (app.status === 'Обучение завершено' && !review) {
            html += `<button class="btn btn-secondary" onclick="openReviewModal(${app.id})">Оставить отзыв</button>`;
        }
        html += `</td></tr>`;
    }
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

function openReviewModal(appId) {
    currentAppId = appId;
    document.getElementById('reviewText').value = '';
    document.getElementById('reviewModal').style.display = 'block';
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

window.openReviewModal = openReviewModal;