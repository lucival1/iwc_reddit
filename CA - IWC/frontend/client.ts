const data = {
    userId: 1,
    content: "some content"
}

fetch("localhost:8080/api/v1/links",
    {
        method: "POST",
        headers: {
            "x-auth-token": "some token"
        },
        body: "some body"
    });