import Component from '@ember/component';
import { run } from '@ember/runloop';
import { set, get } from '@ember/object';
import Ember from 'ember';
import layout from '../templates/components/copy-button';

export default Component.extend({
  layout: layout,
  attributeBindings: [
    'clipboardText:data-clipboard-text',
    'clipboardTarget:data-clipboard-target',
    'clipboardAction:data-clipboard-action',
    'aria-label',
    'title',
  ],

  /**
   * @property {Array} clipboardEvents - events supported by clipboard.js
   */
  clipboardEvents: ['success', 'error'],

  /**
   * If true - scope event listener to this element
   * If false - scope event listener to document.body (clipboardjs)
   * @property {Boolean} delegateClickEvent
   */
  delegateClickEvent: true,

  didInsertElement() {
    let clipboard;
    if (!get(this, 'delegateClickEvent')) {
      clipboard = new window.ClipboardJS(this.element);
    } else {
      clipboard = new window.ClipboardJS(`#${this.get('elementId')}`);
    }
    set(this, 'clipboard', clipboard);

    get(this, 'clipboardEvents').forEach(action => {
      clipboard.on(action, run.bind(this, e => {
        try {
          if (!this.get('disabled')) {
            this.sendAction(action, e);
          }
        }
        catch(error) {
          Ember.Logger.debug(error.message);
        }
      }));
    });
  },

  willDestroyElement() {
    get(this, 'clipboard').destroy();
  }
});
