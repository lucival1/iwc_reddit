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