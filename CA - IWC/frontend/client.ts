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