/**
 * @fileoverview Prevent multiple component definition per file
 * @author Yannick Croissant
 */
'use strict';

const has = require('has');
const Components = require('../util/Components');

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    docs: {
      description: 'Prevent multiple component definition per file',
      category: 'Stylistic Issues',
      recommended: false
    },

    schema: [{
      type: 'object',
      properties: {
        ignoreStateless: {
          default: false,
          type: 'boolean'
        }
      },
      additionalProperties: false
    }]
  },

  create: Components.detect((context, components) => {
    const configuration = context.options[0] || {};
    const ignoreStateless = configuration.ignoreStateless || false;

    const MULTI_COMP_MESSAGE = 'Declare only one React component per file';

    /**
     * Checks if the component is ignored
     * @param {Object} component The component being checked.
     * @returns {Boolean} True if the component is ignored, false if not.
     */
    function isIgnored(component) {
      return ignoreStateless && /Function/.test(component.node.type);
    }

    // --------------------------------------------------------------------------
    // Public
    // --------------------------------------------------------------------------

    return {
      'Program:exit': function() {
        if (components.length() <= 1) {
          return;
        }

        const list = components.list();
        let i = 0;

        for (const component in list) {
          if (!has(list, component) || isIgnored(list[component]) || ++i === 1) {
            continue;
          }
          context.report({
            node: list[component].node,
            message: MULTI_COMP_MESSAGE
          });
        }
      }
    };
  })
};
