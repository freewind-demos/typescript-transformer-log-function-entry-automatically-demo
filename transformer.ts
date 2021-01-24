import * as ts from 'typescript';

const transformer: ts.TransformerFactory<ts.SourceFile> = context => {
  return sourceFile => {
    const visitor = (node: ts.Node): ts.Node => {
      if (ts.isFunctionDeclaration(node)) {
        const functionName = node.name.text;
        
        const parameters = node.parameters.map((parameter) => ts.createIdentifier(parameter.name.getText()));
        
        const consoleLog = ts.createPropertyAccess(ts.createIdentifier("console"), "log");

        const consoleLogExpression = ts.createCall(consoleLog, [], [ts.createStringLiteral(`Function ${functionName} is called with params:`), ...parameters]);
        const consoleLogStatement = ts.createExpressionStatement(consoleLogExpression);
        node.body.statements = ts.createNodeArray([consoleLogStatement, ...node.body.statements]);

        return node;
      }

      return ts.visitEachChild(node, visitor, context);
    };

    return ts.visitNode(sourceFile, visitor);
  };
};

export default transformer;
