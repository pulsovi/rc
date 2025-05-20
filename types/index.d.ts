// Type definitions for rc 1.2
// Project: https://github.com/dominictarr/rc
// Definitions by: Daniel Rosenwasser <https://github.com/DanielRosenwasser>
//                 BendingBender <https://github.com/BendingBender>
//                 kusyka911 <https://github.com/kusyka911>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.2

interface RcResultType {
    /**
     * Contains all parsed configurations from different sources
     * like '/etc/${appname}rc', '/etc/${appname}/config', and other.
     */
    configs: string[];
    /**
     * same as RcResultType.configs[RcResultType.configs.length - 1]
     */
    config: string;
    _: [];
    /**
     * For compatibility with previous versions of '@types/rc'
     */
    [key: string]: any;
}

declare function rc<T extends object = { [key: string]: any }>(
    name: string,
    /**
     * default configuration object
     * OR
     * path to default configuration file (JSON or INI file)
     */
    defaults?: T | string,
    /**
     * Parsed argv object. For example, if args is `--foo bar`, then this value should be `{foo: 'bar'}`
     * If `argv` is `null` or `undefined`, then `rc`'s default parser will parse `process.argv`.
     */
    argv?: T | null,
    /**
     * Custom config file parser.
     * This function will be passed the string contents of each
     * discovered configuration file should return a parsed object dictionary.
     */
    parse?: ((content: string) => { [key: string]: any }) | null
): T & RcResultType;

export = rc;
