import { run } from '@ember/runloop';
import { registerAsyncHelper } from '@ember/test';
import { getContext } from '@ember/test-helpers';

/* === Integration Test Helpers === */

/**
 * Fires `success` action for an instance of a copy-button component
 * @function triggerSuccess
 * @param {Object} context - integration test’s this context
 * @param {String|Element} selector - selector of the copy-button instance
 * @returns {Void}
 */
export function triggerSuccess(context, selector) {
  fireComponentAction(context, selector, 'success');
}

/**
 * Fires `error` action for an instance of a copy-button component
 * @function triggerError
 * @param {Object} context - integration test’s this context
 * @param {String|Element} selector - selector of the copy-button instance
 * @returns {Void}
 */
export function triggerError(context, selector) {
  fireComponentAction(context, selector, 'error');
}

/* === Acceptance Test Helpers === */

export function triggerCopySuccess(selector) {
    const { owner } = getContext();
    fireComponentActionFromApp(owner, selector, 'success');
}

export function triggerCopyError(selector) {
    const { owner } = getContext();
    fireComponentActionFromApp(owner, selector, 'error');
}

export default function() {
  registerAsyncHelper('triggerCopySuccess', function(app, selector='.copy-btn') {
    fireComponentActionFromApp(app, selector, 'success');
  });

  registerAsyncHelper('triggerCopyError', function(app, selector='.copy-btn') {
    fireComponentActionFromApp(app, selector, 'error');
  });
}

/* === Private Functions === */

/**
 * Fires named action for an instance of a copy-button component in an app
 * @function fireComponentActionFromApp
 * @param {Object} app - Ember application
 * @param {String|Element} selector - selector of the copy-button instance
 * @param {String} actionName - name of action
 * @returns {Void}
 */
function fireComponentActionFromApp(app, selector, actionName) {
  fireComponentAction({
    container: app.__container__,
    $: app.$
  }, selector, actionName);
}

/**
 * Fires named action for an instance of a copy-button component
 * @function fireComponentAction
 * @param {Object} context - test context
 * @param {String|Element} selector - selector of the copy-button instance
 * @param {String} actionName - name of action
 * @returns {Void}
 */
function fireComponentAction(context, selector, actionName) {
  const component = getComponentBySelector(context, selector);
  fireActionByName(component, actionName);
}

/**
 * Fetches component reference for a given context and selector
 * @function getComponentBySelector
 * @param {Object} context - test context
 * @param {String|Element} selector - selector of the copy-button instance
 * @returns {Object} component object
 */
function getComponentBySelector(context, selector='.copy-btn') {
  const emberId = document.querySelector(selector).getAttribute('id');
  const { owner } = getContext();
  return owner.lookup('-view-registry:main')[emberId];
}

/**
 * Fires a component's action given an action name
 * @function fireActionByName
 * @param {Ember.Component} component - component to fire action from
 * @param {String} actionName - name of action
 * @returns {Void}
 */
function fireActionByName(component, actionName) {
  const action = component[actionName];

  run(() => {
    if (typeof action === 'string') {
      component.sendAction(action);
    } else {
      action();
    }
  });
}
