// fetch JWT TOKEN
let getAuth = (async (email_: string, password_: string) => {
    const userData = {
        email: email_,
        password: password_
    };

    const response = await fetch(
        "http://localhost:8080/api/v1/auth/login",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData)
        }
    );
    const json = await response.json();
    console.log(json);
});


// fetch user data
let getUser = (async (id: number) => {

    const response = await fetch(
        "http://localhost:8080/api/v1/users/" +id,
        {
            method: "GET"
        }
    );
    const json = await response.json();
    console.log(json);
});


// fetch new user
let newUser = (async (email_: string, password_: string) => {
    const userData = {
        email: email_,
        password: password_
    };
    const response = await fetch("http://localhost:8080/api/v1/users",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQzMzI4Nzc3fQ._Y6gzUDLh-Axhzp-0rYHQGyzRYiq73o81nMawIRjeaA"
            },
            body: JSON.stringify(userData)
        });
    const json = await response.json();
    console.log(json);
});


// fetch all links data
let getLinks = (async () => {
    const response = await fetch(
        "http://localhost:8080/api/v1/links/",
        {
            method: "GET"
        }
    );
    const json = await response.json();
    console.log(json);
});


// fetch link data
let getLink = (async (linkId: number) => {
    const response = await fetch(
        "http://localhost:8080/api/v1/links/" + linkId,
        {
            method: "GET"
        }
    );
    const json = await response.json();
    console.log(json);
});


// post a new link
let postLink = (async (title_: string, url_: string) => {
    const linkData = {
        title: title_,
        url: url_
    };

    const response = await fetch(
        "http://localhost:8080/api/v1/links",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ0MDA2NDc1fQ.VeTElpEPlPzefezB4PXtZGSPzutEGLfefaEAwJjIob4"
            },
            body: JSON.stringify(linkData)
        }
    );
    const json = await response.json();
    console.log(json);
});


// delete a link
let deleteLink = (async (linkId: number) => {
    const response = await fetch(
        "http://localhost:8080/api/v1/links/" + linkId,
        {
            method: "DELETE",
            headers: {
                "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ0MDA2NDc1fQ.VeTElpEPlPzefezB4PXtZGSPzutEGLfefaEAwJjIob4"
            }
        }
    );
    const json = await response.json();
    console.log(json);
});


// upvote a link
let upvoteLink = (async (linkId: number) => {
    const response = await fetch(
        "http://localhost:8080/api/v1/links/" + linkId + "/upvote",
        {
            method: "POST",
            headers: {
                "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ0MDA2NDc1fQ.VeTElpEPlPzefezB4PXtZGSPzutEGLfefaEAwJjIob4"
            }
        }
    );
    const json = await response.json();
    console.log(json);
});


// downvote a link
let downvoteLink = (async (linkId: number) => {
    const response = await fetch(
        "http://localhost:8080/api/v1/links/" + linkId + "/downvote",
        {
            method: "POST",
            headers: {
                "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ0MDA2NDc1fQ.VeTElpEPlPzefezB4PXtZGSPzutEGLfefaEAwJjIob4"
            }
        }
    );
    const json = await response.json();
    console.log(json);
});