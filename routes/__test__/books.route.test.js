import { createBook, listBooks, updateBook, deleteBook } from '../books.route';
import { BookModel } from '../../models/book.model';
import { getConnection } from '../../config/db.js'


jest.mock('../../config/db.js');
jest.mock('../../models/book.model');



describe('books route functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });


    describe('createBook', () => {

        it('should create a book and send it', async () => {
            const req = { body: { title: 'BookTitle' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            const next = jest.fn();

            const saveMock = jest.fn()
            const bookMock = { save: saveMock };

            const session = { withTransaction: jest.fn(async (cb) => await cb()), endSession: jest.fn() };
            const connection = { startSession: jest.fn().mockResolvedValue(session) };
            getConnection.mockResolvedValue(connection);
            BookModel.mockReturnValue(bookMock)

            await createBook(req, res, next);

            expect(getConnection).toHaveBeenCalled();
            expect(connection.startSession).toHaveBeenCalled();
            expect(BookModel).toHaveBeenCalledWith({ ...req.body });
            expect(saveMock).toHaveBeenCalled();
            expect(session.withTransaction).toHaveBeenCalled();
            expect(session.endSession).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.send).toHaveBeenCalledWith(bookMock);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with error if an error occurs', async () => {
            const req = { body: { title: 'BookTitle' } };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            const next = jest.fn();

            const saveMock = jest.fn()
            const bookMock = { save: saveMock };

            BookModel.mockReturnValue(bookMock)


            const session = { withTransaction: jest.fn(async (cb) => { await cb(); throw new Error('Database error') }), endSession: jest.fn() };
            const connection = { startSession: jest.fn().mockResolvedValue(session) };

            getConnection.mockResolvedValue(connection);



            await createBook(req, res, next);

            expect(getConnection).toHaveBeenCalled();
            expect(connection.startSession).toHaveBeenCalled();
            expect(BookModel).toHaveBeenCalledWith({ ...req.body });
            expect(session.withTransaction).toHaveBeenCalled();
            expect(session.endSession).not.toHaveBeenCalled();
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalledWith(new Error('Database error'));
        });
    });
    describe('listBooks', () => {


        it('should return a list of books', async () => {

            const bookReturn = ['Book 1', 'Book 2', 'Book 3']
            const bookModelSpy = jest.spyOn(BookModel, 'find').mockResolvedValue(bookReturn)

            const resSendMock = jest.fn()

            const req = {}; // Mock the request object
            const res = {
                status: jest.fn().mockReturnThis(), // Mock the status method to return itself
                send: resSendMock, // Mock the send method
            };
            const next = jest.fn(); // Mock the next function

            await listBooks(req, res, next);


            expect(bookModelSpy).toHaveBeenCalledTimes(1); // Check if the find method is called once
            expect(res.status).toHaveBeenCalledWith(200); // Check if the status method is called with 200 status code
            expect(resSendMock).toHaveBeenCalledWith(bookReturn); // Check if the send method is called with the array of books
            expect(next).not.toHaveBeenCalled(); // Check if the next function is not called
        });



        it('should call the next function with the error', async () => {
            const thrownError = new Error('some error')

            const bookModelSpy = jest.spyOn(BookModel, 'find').mockRejectedValue(thrownError)

            const req = {}; // Mock the request object
            const res = {
                status: jest.fn().mockReturnThis(), // Mock the status method to return itself
                send: jest.fn(), // Mock the send method
            };
            const next = jest.fn(); // Mock the next function

            await listBooks(req, res, next);

            expect(bookModelSpy).toHaveBeenCalledTimes(1); // Check if the find method is called once
            expect(res.status).not.toHaveBeenCalled(); // Check if the status method is not called
            expect(res.send).not.toHaveBeenCalled(); // Check if the send method is not called
            expect(next).toHaveBeenCalledWith(thrownError); // Check if the next function is called with the error
        });
    });



    describe('updateBook', () => {
        it('should update the book and send a response with the updated book', async () => {
            const req = {
                params: {
                    id: 'bookId',
                },
                body: {
                    title: 'New Title',
                },
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn(),
            };
            const next = jest.fn();

            const session = { withTransaction: jest.fn(async (cb) => await cb()), endSession: jest.fn() };
            const connection = { startSession: jest.fn().mockResolvedValue(session) };
            getConnection.mockResolvedValue(connection);

            const expectedResult = { _id: 'bookId', title: 'New Title' };
            jest.spyOn(BookModel, 'findByIdAndUpdate').mockResolvedValueOnce(expectedResult);

            await updateBook(req, res, next);

            expect(BookModel.findByIdAndUpdate).toHaveBeenCalledWith('bookId', { title: 'New Title' }, { returnDocument: 'after' });
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(expectedResult);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with the error if an error occurs during book update', async () => {
            const req = {
                params: {
                    id: 'bookId',
                },
                body: {
                    title: 'New Title',
                },
            };
            const res = {
                status: jest.fn(),
                send: jest.fn(),
            };
            const next = jest.fn();
            const error = new Error('Transaction error')
            const session = { withTransaction: jest.fn(async (cb) => { await cb(); throw error }), endSession: jest.fn() };
            const connection = { startSession: jest.fn().mockResolvedValue(session) };
            getConnection.mockResolvedValue(connection);
            jest.spyOn(BookModel, 'findByIdAndUpdate').mockResolvedValueOnce({ _id: 'bookId', title: 'New Title' });

            await updateBook(req, res, next);

            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
        });
    });

    describe('deleteBook', () => {

        it('should delete the book with the id', async () => {
            const req = {
                params: {
                    id: 'bookId'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const next = jest.fn();
            const bookSpy = jest.spyOn(BookModel, 'findByIdAndDelete').mockResolvedValueOnce()
            const session = { endSession: jest.fn(), withTransaction: jest.fn().mockImplementation(async (cb) => await cb()) }
            getConnection.mockResolvedValue({
                startSession: jest.fn().mockResolvedValueOnce(session),

            })

            await deleteBook(req, res, next);

            expect(getConnection).toHaveBeenCalledTimes(1);
            expect(bookSpy).toHaveBeenCalledTimes(1);
            expect(bookSpy).toHaveBeenCalledWith('bookId');
            expect(res.status).toHaveBeenCalledTimes(1);
            expect(res.status).toHaveBeenCalledWith(204);
            expect(res.send).toHaveBeenCalledTimes(1);
            expect(next).not.toHaveBeenCalled();
        });

        it('should call next with the error if an error occurs during book delete', async () => {
            const req = {
                params: {
                    id: 'bookId'
                }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                send: jest.fn()
            };

            const next = jest.fn();

            const error = new Error('Some error')

            const bookSpy = jest.spyOn(BookModel, 'findByIdAndDelete').mockRejectedValueOnce(error)
            const session = { endSession: jest.fn(), withTransaction: jest.fn().mockImplementation(async (cb) => await cb()) }
            getConnection.mockResolvedValue({
                startSession: jest.fn().mockResolvedValueOnce(session),

            })


            await deleteBook(req, res, next);

            expect(getConnection).toHaveBeenCalledTimes(1);
            expect(bookSpy).toHaveBeenCalledTimes(1);
            expect(bookSpy).toHaveBeenCalledWith('bookId');
            expect(next).toHaveBeenCalledTimes(1);
            expect(next).toHaveBeenCalledWith(error);
            expect(res.status).not.toHaveBeenCalled();
            expect(res.send).not.toHaveBeenCalled();
        });

    })
});



