const path = require('path');

module.exports = function babelDataSourcePlugin({ types: t }, args) {
    const atrr = args?.attributes || "data-source"
    return {
        name: 'babel-jsx-data-source-plugin',
        visitor: {
            JSXOpeningElement(jsxPath, state) {
                const { node } = jsxPath;
                const isIntrinsicTag =
                    t.isJSXIdentifier(node.name) && /^[a-z]/.test(node.name.name);

                if (!isIntrinsicTag) {
                    return;
                }

                const hasDataSource = node.attributes.some(
                    (attribute) =>
                        t.isJSXAttribute(attribute) &&
                        t.isJSXIdentifier(attribute.name, { name: atrr })
                );

                if (hasDataSource) {
                    return;
                }

                const filename = state.file?.opts?.filename || 'unknown-file';
                const relativeFileName =
                    filename === 'unknown-file' ? filename : path.relative(process.cwd(), filename);
                const line = node.loc?.start?.line ?? 0;
                const column = node.loc?.start?.column ?? 0;
                const sourceValue = `${relativeFileName}:${line}:${column}`;

                node.attributes.unshift(
                    t.jsxAttribute(t.jsxIdentifier(atrr), t.stringLiteral(sourceValue))
                );
            }
        }
    };
};