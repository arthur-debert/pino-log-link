import {
    HttpError,
    InvalidModuleMapSerializationError,
    NetworkError,
} from "./errors";

describe("errors", () => {
    describe("NetworkError", () => {
        it("should return the correct string representation", () => {
            const error = new NetworkError("Not Found", "https://example.com", {
                cause: new HttpError("Not Found", 404),
            });
            expect(error.toString()).toBe(
                "NetworkError: https://example.com (HTTP Code: Not Found)"
            );
        });
    });

    describe("HttpError", () => {
        it("should return the correct string representation", () => {
            const error = new HttpError("Not Found", 404);
            expect(error.toString()).toBe(
                "HTTPError: 404 (HTTP Code: Not Found)"
            );
        });
    });

    describe("InvalidModuleMapSerializationError", () => {
        it("should return the correct string representation", () => {
            const error = new InvalidModuleMapSerializationError(
                "Invalid JSON string",
                "This is not a JSON string"
            );
            expect(error.toString()).toBe(
                "InvalidModuleMapSerializationError: Invalid JSON string, This is not a JSON string"
            );
        });
    });
});

