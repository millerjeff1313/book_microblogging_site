async function deletePost(id){
    let message = {"id": id};

    const result = await fetch("/api/delete_post", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    })

    if (!result.ok) {
        console.log(result.status)
    }
    else {
        console.log("Deleted post");
        window.location.reload();
    }
}

