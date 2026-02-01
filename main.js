const API_URL = "http://localhost:3000";

/**
 * Hàm lấy ID tự tăng dạng chuỗi: MaxId + 1
 */
async function generateNextId(resource) {
    const res = await fetch(`${API_URL}/${resource}`);
    const data = await res.json();
    if (data.length === 0) return "1";
    const ids = data.map(item => parseInt(item.id));
    return (Math.max(...ids) + 1).toString();
}

// ==========================================
// 1. QUẢN LÝ POSTS (FULL CRUD)
// ==========================================

async function renderPosts() {
    const res = await fetch(`${API_URL}/posts`);
    const posts = await res.json();
    const container = document.getElementById('postList');
    
    container.innerHTML = posts.map(post => `
        <div class="item">
            <span class="${post.isDeleted ? 'deleted-row' : ''}">
                <strong>ID: ${post.id}</strong> - ${post.title} 
                ${post.isDeleted ? '(Đã xoá mềm)' : ''}
            </span>
            <div class="actions">
                <button class="btn-edit" onclick="handleUpdatePost('${post.id}')">Sửa</button>
                <button class="btn-soft" onclick="softDeletePost('${post.id}')">Xoá mềm</button>
                <button class="btn-del" onclick="hardDeletePost('${post.id}')">Xoá cứng</button>
            </div>
        </div>
    `).join('');
}

async function handleCreatePost() {
    const titleInput = document.getElementById('postTitle');
    if (!titleInput.value) return alert("Nhập tiêu đề!");

    const nextId = await generateNextId('posts');
    const newPost = {
        id: nextId,
        title: titleInput.value,
        views: 0,
        isDeleted: false
    };

    await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
    });
    titleInput.value = '';
    renderPosts();
}

async function handleUpdatePost(id) {
    const newTitle = prompt("Nhập tiêu đề mới:");
    if (!newTitle) return;

    await fetch(`${API_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle })
    });
    renderPosts();
}

async function softDeletePost(id) {
    await fetch(`${API_URL}/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDeleted: true })
    });
    renderPosts();
}

async function hardDeletePost(id) {
    if (confirm("Xoá vĩnh viễn post này?")) {
        await fetch(`${API_URL}/posts/${id}`, { method: 'DELETE' });
        renderPosts();
    }
}

// ==========================================
// 2. QUẢN LÝ COMMENTS (FULL CRUD)
// ==========================================

async function renderComments() {
    const res = await fetch(`${API_URL}/comments`);
    const comments = await res.json();
    const container = document.getElementById('commentList');

    container.innerHTML = comments.map(c => `
        <div class="item">
            <span><strong>Post ${c.postId}:</strong> ${c.text}</span>
            <div class="actions">
                <button class="btn-edit" onclick="handleUpdateComment('${c.id}')">Sửa</button>
                <button class="btn-del" onclick="deleteComment('${c.id}')">Xoá</button>
            </div>
        </div>
    `).join('');
}

async function handleCreateComment() {
    const textInput = document.getElementById('commentText');
    const postIdInput = document.getElementById('commentPostId');

    if (!textInput.value || !postIdInput.value) return alert("Nhập đủ text và Post ID!");

    const nextId = await generateNextId('comments');
    const newComment = {
        id: nextId,
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

async function handleUpdateComment(id) {
    const newText = prompt("Sửa nội dung bình luận:");
    if (!newText) return;

    await fetch(`${API_URL}/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newText })
    });
    renderComments();
}

async function deleteComment(id) {
    await fetch(`${API_URL}/comments/${id}`, { method: 'DELETE' });
    renderComments();
}

// Khởi chạy
renderPosts();
renderComments();