export class HandlebarsHelpers {
    /**
     * Construct an editor element for rich text editing with TinyMCE
     * @param {object} options              Helper options
     * @param {boolean} [options.owner]     Is the current user an owner of the data?
     * @param {boolean} [options.entities=true] Replace dynamic entity links?
     * @param {Object|Function} [options.rollData] The data object providing context for inline rolls
     * @param {string} [options.content=""]  The original HTML content as a string
     * @return {Handlebars.SafeString}
     */
    static readonlyEditor(options) {
        // Enrich the content
        const owner = Boolean(options.hash['owner']);
        const entities = options.hash['entities'] !== false;
        const rollData = options.hash["rollData"];
        const content = TextEditor.enrichHTML(options.hash['content'] || "", { secrets: owner, entities, rollData });

        // Construct the HTML
        let editor = $(`<div>${content}</div>`);

        return new Handlebars.SafeString(editor[0].outerHTML);
    }

    static formatSpecializations(context) {
        return new Handlebars.SafeString(HandlebarsHelpers._formatSpecializations(context));
    }

    static concat() {
        var outStr = '';
        for (var arg in arguments) {
          if (typeof arguments[arg] != 'object') {
            outStr += arguments[arg];
          }
        }
        return outStr;
    }

    static toLowerCase(str) {
        return str.toLowerCase();
    }

    /**
     * Format the specializations (if any) of a skill as a string between parenthesis.
     * @param {Object} skill The skill containing the potential specializations.
     * @return {string} 
     */
    static _formatSpecializations(skill) {
        if (!skill) return "";

        if (!skill.specializations) {
            return "";
        }

        return ` (${skill.specializations})`;
    }

    static registerHelpers() {
        Handlebars.registerHelper({
            readonlyEditor: HandlebarsHelpers.readonlyEditor,
            formatSpecializations: HandlebarsHelpers.formatSpecializations,
            concat: HandlebarsHelpers.concat,
            toLowerCase: HandlebarsHelpers.toLowerCase,
        });
    }
}