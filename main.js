const API_URL = "http://localhost:3000";

// --- HÀM HỖ TRỢ ---
const getNextId = (items) => {
    if (items.length === 0) return "1";
    const maxId = Math.max(...items.map(item => parseInt(item.id)));
    return (maxId + 1).toString();
};

// --- XỬ LÝ POSTS ---
async function renderPosts() {
    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();
    const container = document.getElementById('postList');
    
    container.innerHTML = posts.map(post => `
        <div class="item ${post.isDeleted ? 'deleted' : ''}">
            <span>[ID: ${post.id}] ${post.title}</span>
            ${!post.isDeleted ? `<button onclick="softDeletePost('${post.id}')">Xoá mềm</button>` : '<span>(Đã xoá)</span>'}
        </div>
    `).join('');
}

async function softDeletePost(id) {
    await fetch(`${API_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
    });
    renderPosts(); // Cập nhật lại giao diện
}

// --- XỬ LÝ COMMENTS (CRUD) ---

// 1. Lấy và hiển thị (Read)
async function renderComments() {
    const res = await fetch(`${API_URL}/comments`);
    const comments = await res.json();
    const container = document.getElementById('commentList');

    container.innerHTML = comments.map(c => `
        <div class="item">
            <div>
                <strong>PostID ${c.postId}:</strong> 
                <span id="text-${c.id}">${c.text}</span>
            </div>
            <div>
                <button onclick="handleUpdateComment('${c.id}')">Sửa</button>
                <button onclick="deleteComment('${c.id}')">Xoá</button>
            </div>
        </div>
    `).join('');
}

// 2. Thêm mới (Create)
async function handleCreateComment() {
    const textInput = document.getElementById('commentText');
    const postIdInput = document.getElementById('commentPostId');

    if (!textInput.value || !postIdInput.value) return alert("Vui lòng nhập đủ thông tin");

    const res = await fetch(`${API_URL}/comments`);
    const comments = await res.json();

    const newComment = {
        id: getNextId(comments),
        text: textInput.value,
        postId: postIdInput.value
    };

    await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment)
    });

    textInput.value = '';
    renderComments();
}

// 3. Cập nhật (Update)
async function handleUpdateComment(id) {
    const newText = prompt("Nhập nội dung mới cho bình luận:");
    if (newText) {
        await fetch(`${API_URL}/comments/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: newText })
        });
        renderComments();
    }
}

// 4. Xoá (Delete)
async function deleteComment(id) {
    if (confirm("Bạn có chắc muốn xoá bình luận này?")) {
        await fetch(`${API_URL}/comments/${id}`, { method: 'DELETE' });
        renderComments();
    }
}

// Khởi tạo ứng dụng
renderPosts();
renderComments();