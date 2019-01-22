import { getHandlers } from "../backend/controllers/link_controller";
import { it, describe } from "mocha";
import { expect } from "chai";
import { Link } from "../backend/entities/link";

describe("Link Controller", () => {

    // Unit test for Post Link
    it("Should be able to post a new Link", (done) => {
        const fakeLink =  {
            title: "Alien",
            url: "testing"
        };
        const linkRepository: any = {
            save: () => {
                return Promise.resolve(fakeLink);
            }
        };
        const handlers = getHandlers(linkRepository);
        const request: any = { fakeLink };
        const response: any = {
            json: (newLink: Link) => {
                expect(newLink.title).eql(fakeLink.title);
                expect(newLink.url).eql(fakeLink.url);
                done();
            }
        };
        handlers.httpPostLinkHandler(request, response);
    })
});
