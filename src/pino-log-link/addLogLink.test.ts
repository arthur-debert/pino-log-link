import addLogLink, { addLogLinkToFormatter } from './addLogLink';

describe('addLogLinkToFormatter', () => {
    it('should add a log link to the log message', () => {
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        const formatters = {
            log: function (logRecord: any) {
                return logRecord;
            },
        };

        // Call addLogLink to modify the formatters object
        const modifiedFormatters = addLogLinkToFormatter(formatters, "log", 'moduleName', () => moduleMap, 'http://localhost:3000/', 'message');

        const logRecord = { moduleName: 'moduleA', message: 'hello' };

        // Directly call the modified formatter function
        const result = modifiedFormatters.log(logRecord);

        expect(result).toEqual({
            message: 'hello http://localhost:3000/project/src/moduleA.ts'
        });
    });
    it('should add a log link to the log message when no formatter is defined', () => {
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        const formatters = {
        };

        // Call addLogLink to modify the formatters object
        const modifiedFormatters = addLogLinkToFormatter(formatters, "log", 'moduleName', () => moduleMap, 'http://localhost:3000/', 'message');

        const logRecord = { moduleName: 'moduleA', message: 'hello' };

        // Directly call the modified formatter function
        const result = modifiedFormatters.log(logRecord);

        expect(result).toEqual({
            message: 'hello http://localhost:3000/project/src/moduleA.ts'
        });
    });

    it('should work when logRecord is missing moduleName', () => {
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        const formatters = {
            log: function (logRecord: any) {
                return logRecord;
            },
        };

        // Call addLogLink to modify the formatters object
        const modifiedFormatters = addLogLinkToFormatter(formatters, "log", 'moduleName', () => moduleMap, 'http://localhost:3000/', 'message');

        const logRecord = { message: 'hello' };

        // Directly call the modified formatter function
        const result = modifiedFormatters.log(logRecord);

        expect(result).toEqual({
            message: 'hello not found!'
        });
    });
});


describe('addLogLink', () => {
    it('should add a log link to the log message', () => {
        const moduleMap = {
            'moduleA': '/project/src/moduleA.ts',
        };
        let config = {
            formatters: {
                log: function (logRecord: any) {
                    return logRecord;
                },
            }
        };

        // Call addLogLink to modify the formatters object
        config = addLogLink(config, 'moduleName', () => moduleMap, 'http://localhost:3000/');

        const logRecord = { moduleName: 'moduleA', msg: 'hello' };

        // Directly call the modified formatter function
        const result = config.formatters.log(logRecord);

        expect(result).toEqual({
            msg: 'hello http://localhost:3000/project/src/moduleA.ts'
        });
    });
});
