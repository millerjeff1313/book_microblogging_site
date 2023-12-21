async function likePost(post) {
    message = {
        'post_id': post
    }
    
    const response = await fetch('/api/like', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    });

    if (response.ok) {
        const result = await response.json();

        post = document.getElementById(`post${post}`);
        like_count = post.getElementsByClassName('likes')[0];
        like_count.innerHTML = result['likes'];

        like_icon = post.getElementsByClassName('like')[0].children[0];

        like_icon.classList.toggle('fa-heart-o');
        like_icon.classList.toggle('fa-heart');
    }
    else {
        alert('Could not like post');
    }
}