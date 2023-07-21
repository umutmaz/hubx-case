import { validationMiddleware } from '../validation/validation.middleware';
import { getSchemas } from '../validation/schemas';

jest.mock('../validation/schemas')

describe('validationMiddleware', () => {


    beforeEach(() => {
        jest.clearAllMocks();
    });


    const mockRequest = (location, value) => ({
        [location]: value,
    });

    const mockResponse = {
        sendStatus: jest.fn(),
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };

    const mockNext = jest.fn();

    beforeEach(() => {
        mockResponse.sendStatus.mockClear();
        mockResponse.status.mockClear();
        mockResponse.send.mockClear();
        mockNext.mockClear();
    });



    it('should return 500 status if schema is not found', () => {


        getSchemas.mockReturnValue({})


        const middleware = validationMiddleware('nonExistingSchema', 'body');
        middleware(mockRequest('body', {}), mockResponse, mockNext);
        expect(mockResponse.sendStatus).toHaveBeenCalledWith(500);
    });

    it('should return 400 status if validation fails', () => {
        const mockValidationError = new Error('validation failed')

        const schema = 'failingSchema'

        getSchemas.mockReturnValue({
            [schema]: {
                validate: jest.fn().mockReturnValue({ error: mockValidationError })
            }
        })


        const middleware = validationMiddleware(schema, 'params');
        middleware(mockRequest('params', { invalidParam: '123' }), mockResponse, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.send).toHaveBeenCalledWith(mockValidationError.message);
    });

    it('should call next() if validation succeeds', () => {

        const schema = 'passingSchema'

        getSchemas.mockReturnValue({
            [schema]: {
                validate: jest.fn().mockReturnValue({ message: "Passed!" })
            }
        })

        const middleware = validationMiddleware(schema, 'query');
        middleware(mockRequest('query', { validParam: '123' }), mockResponse, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});
