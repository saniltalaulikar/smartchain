const Interpreter = require('./index')

const  {
    STOP,
    ADD,
    PUSH,
    SUB, 
    MUL,
    DIV, 
    LT,
    GT,
    EQ,
    AND,  
    OR,
    JUMP,
    JUMPI
} = Interpreter.OPCODE_MAP;

describe('Interpreter', () => {
    describe('runCode()', () => {
        describe('and the code includes ADD', () => {
            it('adds two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, ADD, STOP])
                    ).toEqual(5);
            });
        }); 

        describe('and the code includes SUB', () => {
            it('subs two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, SUB, STOP])
                    ).toEqual(1);
            });
        }); 

        describe('and the code includes MUL', () => {
            it('muls two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, MUL, STOP])
                    ).toEqual(6);
            });
        }); 

        describe('and the code includes DIV', () => {
            it('muls two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, DIV, STOP])
                    ).toEqual(1.5);
            });
        }); 

        describe('and the code includes LT', () => {
            it('LT two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, LT, STOP])
                    ).toEqual(0);
            });
        });
        
        describe('and the code includes GT', () => {
            it('GT two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 3, GT, STOP])
                    ).toEqual(1);
            });
        });

        describe('and the code includes EQ', () => {
            it('eq two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 2, PUSH, 2, EQ, STOP])
                    ).toEqual(1);
            });
        });

        describe('and the code includes AND', () => {
            it('AND two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 1, PUSH, 0, AND, STOP])
                    ).toEqual(0);
            });
        });

        describe('and the code includes OR', () => {
            it('OR two values', () => {
                expect(
                    new Interpreter().runCode([PUSH, 1, PUSH, 0, OR, STOP])
                    ).toEqual(1);
            });
        });

        describe('and the code includes JUMP', () => {
            it('JUMPS', () => {
                expect(
                    new Interpreter().runCode([PUSH, 6, JUMP, PUSH, 0, JUMP, PUSH, 'Jump Successful', STOP])
                    ).toEqual('Jump Successful');
            });
        });

        describe('and the code includes JUMPI', () => {
            it('JUMPI', () => {
                expect(
                    new Interpreter().runCode([PUSH, 8, PUSH, 1 , JUMPI, PUSH, 0, JUMP, PUSH, 'Jump Successful', STOP])
                    ).toEqual('Jump Successful');
            });
        });

        describe('and the code includes invalid JUMP destination', () => {
            it('throws an error', () => {
                expect(
                        () => new Interpreter().runCode([PUSH, 99, JUMP, PUSH, 0, JUMP, PUSH, 'Jump Successful', STOP])
                    ).toThrow('Invalid destination: 99');
            });
        });

        describe('and the code includes invalid PUSH value', () => {
            it('throws an error', () => {
                expect(() => new Interpreter().runCode([PUSH, 0, PUSH])).toThrow("The 'PUSH' instruction cannot be last.");
            });
        });

        describe('and the code includes infinite loop', () => {
            it('throws an error', () => {
                expect(() => new Interpreter().runCode([PUSH, 0, JUMP, STOP])).toThrow("check for an infinite  loop execution  limit of 10000 execeeded");
            });
        });
    });
});
   