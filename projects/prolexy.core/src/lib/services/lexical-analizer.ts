import { dateOperations, EOF, IType, KeyWords, logicalOperations, numericOperations, Operations, PrimitiveTypes, relationalOperations, stringOperations, Token, TokenType } from "../models/token";

class TokenDefinition {
    constructor(private returnsToken: TokenType, private regexPattern: string | RegExp, private type: IType | null = null) { }
    match(inputString: string): TokenMatch {
        var match = inputString.match(this.regexPattern);
        if (match?.length) {
            var remainingText = '';
            if (match[0].length != inputString.length)
                remainingText = inputString.substring(match[0].length);
            var isWord = match[0].match(/^[\w, ]+/)?.length;
            if (!isWord || (isWord && !remainingText.match(/^[\w,\d]/)?.length))
                return new TokenMatch(true,
                    this.returnsToken,
                    match[0],
                    remainingText,
                    this.type);
        }

        return new TokenMatch(false, null, '', '', null);
    }
}
class TokenMatch {
    constructor(public IsMatch: boolean, public TokenType: (TokenType | null),
        public Value: string, public RemainingText: string, public Type: IType | undefined | null) { }
}
let _tokenDefinitions =
    [
        new TokenDefinition(TokenType.const, "^null", PrimitiveTypes.null),
        new TokenDefinition(TokenType.const, /^\d{4}\/\d{1,2}\/\d{1,2}/, PrimitiveTypes.datetime),
        new TokenDefinition(TokenType.const, "^'[^']*'", PrimitiveTypes.string),
        new TokenDefinition(TokenType.const, /^"[^"]*"/, PrimitiveTypes.string),
        new TokenDefinition(TokenType.const, "^\\d+(\\.\\d+)?", PrimitiveTypes.number),
        new TokenDefinition(TokenType.const, "^(true|false)", PrimitiveTypes.bool),
        new TokenDefinition(TokenType.operation, `^\\${Operations.begin_parentese}`),
        new TokenDefinition(TokenType.operation, `^\\${Operations.end_parentese}`),
        new TokenDefinition(TokenType.operation, `^\\${Operations.comma}`),
        new TokenDefinition(TokenType.operation, `^\\${Operations.point}`),
        new TokenDefinition(TokenType.operation, `^\\${Operations.arrowFunction}`),
    ];
for (var key of Object.values(KeyWords))
    _tokenDefinitions.push(new TokenDefinition(TokenType.keyword, `^${key}`));
for (var op of stringOperations
    .concat(logicalOperations)
    .concat(dateOperations)
    .concat(relationalOperations))
    _tokenDefinitions.push(new TokenDefinition(TokenType.operation, `^${op}`));
for (var op of numericOperations)
    _tokenDefinitions.push(new TokenDefinition(TokenType.operation, `^\\${op}`));
_tokenDefinitions.push(new TokenDefinition(TokenType.identifier, /^\w(\w|\d|_)*/));
_tokenDefinitions.push(new TokenDefinition(TokenType.const, /^\$\{\w+\:[\u0600-\u06FF,\w,\s]*\:enum\}*/, PrimitiveTypes.enum));
_tokenDefinitions.push(new TokenDefinition(TokenType.const, /^\$\{\w+\:[\u0600-\u06FF,\w,\s]*\:string\}*/, PrimitiveTypes.string));
_tokenDefinitions.push(new TokenDefinition(TokenType.const, /^\$\{\d+\:[\u0600-\u06FF,\w,\s]*\:number\}*/, PrimitiveTypes.number));

export class Lexer {
    public Tokenize(lqlText: string): Array<Token> {
        var tokens = new Array<Token>();

        var remainingText = lqlText;

        while (remainingText) {
            var match = this.FindMatch(remainingText);
            if (match.IsMatch) {
                tokens.push(new Token(match.TokenType!, match.Value, match.Type!));
                remainingText = match.RemainingText;
            }
            else {
                if (this.IsWhitespace(remainingText) || remainingText === '$') {
                    remainingText = remainingText.substring(1);
                }
                else {
                    var invalidTokenMatch = this.CreateInvalidTokenMatch(remainingText);
                    tokens.push(new Token(invalidTokenMatch.TokenType!, invalidTokenMatch.Value));
                    remainingText = invalidTokenMatch.RemainingText;
                }
            }
        }

        tokens.push(EOF);

        return tokens;
    }

    private FindMatch(lqlText: string): TokenMatch {
        for (var tokenDefinition of _tokenDefinitions) {
            var match = tokenDefinition.match(lqlText);
            if (match.IsMatch) {
                if (match.TokenType != TokenType.keyword || match.RemainingText.length == 0 ||
                    !match.RemainingText[0].match(/([a-z]|[0-9])/i))
                    return match;
            }
        }

        return new TokenMatch(false, null, '', '', null);
    }

    private IsWhitespace(lqlText: string): boolean {
        return ((lqlText.match("^\\s+")?.length) ?? -1) > 0;
    }

    private CreateInvalidTokenMatch(lqlText: string): TokenMatch {
        // var match = Regex.Match(lqlText, "(^\\S+\\s)|^\\S+");
        // if (match.Success)
        // {
        //     return new TokenMatch()
        //     {
        //         IsMatch = true,
        //         RemainingText = lqlText.Substring(match.Length),
        //         TokenType = TokenType.Invalid,
        //         Value = match.Value.Trim()
        //     };
        // }

        throw ("Failed to generate invalid token");
    }

}