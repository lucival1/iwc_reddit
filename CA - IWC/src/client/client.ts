// Read one movie by ID
(async () => {
    const response = await fetch(
        "http://localhost:8080/movies/1",
        {
            method: "GET"
        }
    );
    const json = await response.json();
    console.log(json);
})();
