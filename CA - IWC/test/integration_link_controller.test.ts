import { getApp } from "../backend/config/app";
import { it, describe } from "mocha";
import { expect } from "chai";
import request from "supertest";

// fake data to post
const fakeLink =  {
    title: 'Integration test',
    url: 'www.integrationtest.ie'
};

describe("Integration test: Link Controller", () => {
    console.log(
        `
            The following environment variables must be exported before running this test
            DATABASE_USER='DB user login'
            DATABASE_PASSWORD='DB password'
            DATABASE_HOST=localhost
            DATABASE_PORT=5432
            DATABASE_DB='DB name'
            AUTH_SECRET=123
        `
    );

    it(`Should be able to post a new Link`,
        (done) => {

            (async () => {
                const app = await getApp(true);

                request(app)
                    .post('/api/v1/links')
                    .type('form')
                    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQzMzM0ODEyfQ.7th3UHGRANQ6gQ0-yEiEpSCI9izDd9LoglKmxfbaWPE')
                    .set('x-auth-token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTQ0MDA2NDc1fQ.VeTElpEPlPzefezB4PXtZGSPzutEGLfefaEAwJjIob4')
                    .send(fakeLink)
                    .expect(201)
                    .expect('Content-Type', /json/)
                    .expect(function(res) {
                        expect(res.body.data.title).to.eq("Integration test");
                        expect(res.body.data.url).to.eq("www.integrationtest.ie");
                    })
                    .end(function(err, res) {
                        if (err) throw err;
                        done();
                    });

            })();
        }
    );
});

