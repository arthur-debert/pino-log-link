import addLogLink from './addLogLink';

describe('addLogLink', () => {
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
        const modifiedFormatters = addLogLink(formatters, "log", 'moduleName', () => moduleMap, 'http://localhost:3000/', 'message');

        const logRecord = { moduleName: 'moduleA', message: 'hello' };

        // Directly call the modified formatter function
        const result = modifiedFormatters.log(logRecord);

        expect(result).toEqual({
            message: 'hello http://localhost:3000/project/src/moduleA.ts'
        });
    });
});
