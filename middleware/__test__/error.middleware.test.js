import ErrorHandler from '../error/error.middleware'


describe('ErrorHandler', () => {

    it('sets the status code of the error correctly', () => {
        // Mock the response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the ErrorHandler function with an error object
        const err = new Error("Test error");
        err.statusCode = 404;
        ErrorHandler(err, null, res, null);

        // Check if res.status was called with the correct status code
        expect(res.status).toHaveBeenCalledWith(404);

        // Check if res.json was called with the correct response object
        expect(res.json).toHaveBeenCalledWith({
            status: 404,
            message: "Test error",
        });

    })

    it('uses the defaults if error statuscode or message is undefined', () => {
        // Mock the response object
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };

        // Call the ErrorHandler function with an empty error object
        ErrorHandler({}, null, res, null);

        // Check if res.status was called with the default status code (500)
        expect(res.status).toHaveBeenCalledWith(500);

        // Check if res.json was called with the default error message
        expect(res.json).toHaveBeenCalledWith({
            status: 500,
            message: "Something went wrong",
        });

    })
})  